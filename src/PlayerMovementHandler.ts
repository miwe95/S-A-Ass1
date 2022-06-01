import { Container, Graphics, InteractionEvent, Sprite } from "pixi.js";
import { RigidBody } from "./Rigidbody";
import { vec2 } from "gl-matrix";


export class PlayerMovementHandler extends Container {
    private slingshot: Sprite;
    private slingshot_rope_left: Graphics;
    private slingshot_rope_right: Graphics;
    private player: Sprite;
    private rigid_body: RigidBody;

    constructor(_screenWidth: number, screenHeight: number) {
        super();
        this.slingshot_rope_right = new Graphics();
        this.addChild(this.slingshot_rope_right);

        //player
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
        this.rigid_body = new RigidBody(_screenWidth, screenHeight, this.player);

    }

    //Called when Ticker starts
    update = (dt: number): void => {
        this.rigid_body.move(dt);
    }

    drawDebugCircle(x:number,y:number){
        const gr = new Graphics();
        gr.beginFill(0xffffff);
        gr.drawCircle(x, y, 5);
        gr.endFill();
        this.addChild(gr)
    }
    //Called when left mousebutton is released
    private firePlayer = (_e: InteractionEvent): void => {
        this.rigid_body.resetPlayerVars();
        this.clearListenerPlayerFire(_e);
        let slingshot_mid: vec2 = vec2.fromValues(this.slingshot.x+5, this.slingshot.y-55);
        let player_pos: vec2 = vec2.fromValues(this.player.x, this.player.y);
        this.drawDebugCircle(slingshot_mid[0], slingshot_mid[1]);
        this.drawDebugCircle(player_pos[0], player_pos[1]);
        let angle = vec2.angle(player_pos, slingshot_mid);
        let angle_degrees = angle * 180 / Math.PI;
        console.log("Angle Degree: " + angle_degrees);
        console.log("Angle Radians: " + angle);
        let distance : number = vec2.dist(slingshot_mid, player_pos);
        if(distance >= 200)
        {
            this.rigid_body.linear_velocity.x *= 1;
            this.rigid_body.linear_velocity.y *= 1;
        }
        else
        {
            this.rigid_body.linear_velocity.x *= distance / 200;
            this.rigid_body.linear_velocity.y *= distance / 200;
        }
        console.log("Distance: " + distance);
        this.rigid_body.move_ = true;
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
        this.rigid_body.move_ = false;
        this.player.x = this.slingshot.x;
        this.player.y = this.slingshot.y - 50;
        this.rigid_body.resetPlayerVars();
        this.player.on("mousemove", this.moveRopeAndPlayer);
        this.player.on("mouseup", this.firePlayer);
        this.slingshot.on("mouseup", this.firePlayer);
    }


}