
import { vec2 } from "gl-matrix";
import { Container, Graphics, InteractionEvent, Sprite } from "pixi.js";

export class ParticleDynamics extends Container {

    //@ts-ignore
    private mass: number;

    player_velocity: vec2;

    private screenheigth: number;

    private screenwidth: number;
    //@ts-ignore
    private gravity: boolean;
    move_: boolean;
    //@ts-ignore
    private acceleration: number;
    launching_angle: number;
    euler: boolean;
    trajectory: boolean;
    private slingshot: Sprite;
    private slingshot_rope_left: Graphics;
    private slingshot_rope_right: Graphics;
    private player: Sprite;
    private trajectory_points: Array<Graphics>;

    constructor(screenWidth: number, screenHeight: number) {
        super();
        this.euler = false;
        this.trajectory = false;
        this.trajectory_points = [];
        this.screenheigth = screenHeight;
        this.screenwidth = screenWidth;
        this.mass = 0.5;
        this.player_velocity = vec2.fromValues(2000, -2000);
        this.gravity = true;
        this.acceleration = 0;
        this.move_ = false;
        this.launching_angle = 0;

        this.slingshot_rope_right = new Graphics();
        this.addChild(this.slingshot_rope_right);

        //player sprite
        this.player = Sprite.from("player.png");
        this.player.anchor.set(0.5);
        this.player.scale.x = 0.1;
        this.player.scale.y = 0.1;
        this.player.x = 100;
        this.player.y = screenHeight - 50;
        this.player.interactive = true;
        this.addChild(this.player);

        //slingshot rope left
        this.slingshot_rope_left = new Graphics();
        this.addChild(this.slingshot_rope_left);

        //slingshot
        this.slingshot = Sprite.from("slingshot.png");
        this.slingshot.anchor.set(0.5);
        this.slingshot.scale.x = 0.08;
        this.slingshot.scale.y = 0.08;
        this.slingshot.x = 200;
        this.slingshot.y = screenHeight - 130;
        this.slingshot.interactive = true;
        this.addChild(this.slingshot);
        this.slingshot.on("mousedown", this.preparePlayer);
    }

    private ODE(dt: number): vec2 {
        if (this.euler) {
            //euler
            let force_vec: vec2 = this.getForce(this.player.x, this.player.y);
            vec2.add(this.player_velocity, this.player_velocity, force_vec);
            return vec2.fromValues((this.player_velocity[0]), (this.player_velocity[1]));
        }
        else {
            //runge kutta
            let k1 = vec2.fromValues(0, 0);
            let k2 = vec2.fromValues(0, 0);
            let k3 = vec2.fromValues(0, 0);
            let k4 = vec2.fromValues(0, 0);

            //k1
            let force_vec: vec2 = this.getForce(this.player.x, this.player.y);
            vec2.scale(k1, force_vec, dt);
            vec2.add(k1, this.player_velocity, k1);
            this.player_velocity = k1;
            //k2
            force_vec = this.getForce(this.player.x + k1[0] / 2, this.player.y + k1[1] / 2)
            vec2.scale(k2, force_vec, dt);
            vec2.add(k2, this.player_velocity, k2);

            //k3
            force_vec = this.getForce(this.player.x + k2[0] / 2, this.player.y + k2[1] / 2)
            vec2.scale(k3, force_vec, dt);
            vec2.add(k3, this.player_velocity, k3);

            //k4
            force_vec = this.getForce(this.player.x + k3[0], this.player.y + k3[1])
            vec2.scale(k4, force_vec, dt);
            vec2.add(k4, this.player_velocity, k4);

            return vec2.fromValues((1 / 6 * k1[0] + 1 / 3 * k2[0] + 1 / 3 * k3[0] + 1 / 6 * k4[0]), (1 / 6 * k1[1] + 1 / 3 * k2[1] + 1 / 3 * k3[1] + 1 / 6 * k4[1]));
        }
    }
    //@ts-ignore
    private getForce(x: number, y: number) {
        if (x >= this.screenwidth * 0.3 && x <= this.screenwidth * 0.7 && y >= this.screenheigth * 0.2 && y <= this.screenheigth * 0.8) {

            let border_field = vec2.fromValues(this.screenwidth * 0.3, this.screenheigth * 0.2);
            let center_hole = vec2.fromValues(this.screenwidth / 2, this.screenheigth / 2);
            let scale_dist = vec2.dist(border_field, center_hole);
            let sub: vec2 = vec2.fromValues(0, 0);
            let p: vec2 = vec2.fromValues(x, y);
            let center = vec2.fromValues(this.screenwidth / 2, this.screenheigth / 2);
            //@ts-ignore
            let distance = vec2.dist(p, center);
            vec2.sub(sub, center, p);
            return vec2.fromValues(sub[0] / distance * 5 * (1 - distance / scale_dist), sub[1] / distance * 5 * (1 - distance / scale_dist));

        }
        else {
            return vec2.fromValues(0, this.euler ? 9.81 : 0.981);
        }
    }

    resetPlayerVars() {
        this.gravity = false;
        this.move_ = false;
        this.player_velocity = vec2.fromValues(2000, -2000);
    }

    update = (dt: number): void => {
        if (this.move_) {
            this.gravity = true;
            if (this.player.y >= this.screenheigth - 50) {
                this.resetPlayerVars();
            }
            else {
                let new_pos = this.ODE(dt);
                this.player.x += new_pos[0] * dt / 1000;
                this.player.y += new_pos[1] * dt / 1000;
                this.drawTrajectory();
            }
        }
    }

    removeTrajectory(){
        for(let p of this.trajectory_points)
        {
            this.removeChild(p);
        }
        this.trajectory_points = [];
    }

    drawTrajectory() {
        console.log(this.trajectory);
        if (this.trajectory) {
            const gr = new Graphics();
            gr.beginFill(0xffffff);
            gr.drawCircle(this.player.x, this.player.y, 1);
            gr.endFill();
            this.trajectory_points.push(gr);
            this.addChild(gr)
        }
    }

    drawDebugCircle(x: number, y: number) {
        const gr = new Graphics();
        gr.beginFill(0xffffff);
        gr.drawCircle(x, y, 5);
        gr.endFill();
        this.addChild(gr)
    }
    //Called when left mousebutton is released
    private firePlayer = (_e: InteractionEvent): void => {
        this.resetPlayerVars();
        this.clearListenerPlayerFire(_e);
        let slingshot_mid: vec2 = vec2.fromValues(this.slingshot.x + 5, this.slingshot.y - 55);
        let player_pos: vec2 = vec2.fromValues(this.player.x, this.player.y);
        this.drawDebugCircle(slingshot_mid[0], slingshot_mid[1]);
        this.drawDebugCircle(player_pos[0], player_pos[1]);

        let res: vec2 = vec2.fromValues(0, 0);
        vec2.sub(res, slingshot_mid, player_pos);
        let angle = Math.atan(res[1] / res[0]);
        let distance: number = vec2.dist(slingshot_mid, player_pos);
        if (distance >= 200) {
            this.player_velocity[0] *= (1 * distance / 200 * Math.cos(angle));
            this.player_velocity[1] *= (1 * distance / 200 * -Math.sin(angle));

        }
        else {
            this.player_velocity[0] *= (distance / 200 * Math.cos(angle));
            this.player_velocity[1] *= (distance / 200 * -Math.sin(angle));

        }
        console.log("start velocity x: " + this.player_velocity[0]);
        console.log("start velocity y: " + this.player_velocity[1]);
        this.launching_angle = angle;
        this.move_ = true;
    }

    //called to clear drawings when player fired
    private clearListenerPlayerFire = (_e: InteractionEvent): void => {
        this.player.removeAllListeners();
        this.slingshot_rope_left.clear();
        this.slingshot_rope_right.clear();
    }

    //called when left mousebutton is pressed to draw lines
    private moveRopeAndPlayer = (e: InteractionEvent): void => {
        this.player.x = e.data.global.x;
        this.player.y = e.data.global.y;
        this.slingshot_rope_left.clear();
        this.slingshot_rope_right.clear();

        this.slingshot_rope_left.lineStyle(5, 0x7a4931, 1)
            .moveTo(this.slingshot.x - 20, this.slingshot.y - 60)
            .lineTo(this.player.x - 11, this.player.y + 32);

        this.slingshot_rope_right.lineStyle(5, 0x7a4931, 1)
            .moveTo(this.slingshot.x + 20, this.slingshot.y - 60)
            .lineTo(this.player.x - 11, this.player.y + 32);
    }

    //called when left clicked on slingshot
    private preparePlayer = (_e: InteractionEvent): void => {
        this.move_ = false;
        this.player.x = this.slingshot.x;
        this.player.y = this.slingshot.y - 50;
        this.resetPlayerVars();
        this.player.on("mousemove", this.moveRopeAndPlayer);
        this.player.on("mouseup", this.firePlayer);
        this.slingshot.on("mouseup", this.firePlayer);
    }
}
