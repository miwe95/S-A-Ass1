import { vec2 } from "gl-matrix";
import { Container, Graphics, Sprite } from "pixi.js";

export class ParticleDynamics extends Container {

    //@ts-ignore
    private screen_width: number;
    //@ts-ignore
    private screen_height: number;
    private circle: Sprite;
    private velocity: vec2;

    constructor(screenWidth: number, screenHeigth: number) {
        super();
        this.velocity = vec2.fromValues(60,-400);
        this.screen_width = screenWidth;
        this.screen_height = screenHeigth;
        this.circle= Sprite.from("penis.png");
        this.circle.x = screenWidth * 0.1;
        this.circle.y = screenHeigth * 0.8;
        this.circle.scale.x = 0.1;
        this.circle.scale.y = 0.1;
        this.circle.anchor.set(0.5);
        this.circle.interactive = true;
        this.addChild(this.circle);
        this.drawForceField();
    }

    private getForce(x: number, y: number) {
        if (x > this.screen_width * 0.3 && x < this.screen_width * 0.7 && y > this.screen_height * 0.2 && y < this.screen_height * 0.8) {
            console.log("blackhole");
            let border_field = vec2.fromValues(this.screen_width * 0.3, this.screen_height * 0.2);
            let center_hole = vec2.fromValues(this.screen_width / 2, this.screen_height / 2);
            let scale_dist = vec2.dist(border_field, center_hole);
            let sub: vec2 = vec2.fromValues(0, 0);
            let p: vec2 = vec2.fromValues(x, y);
            let center = vec2.fromValues(this.screen_width / 2, this.screen_height / 2);
            //@ts-ignore
            let distance = vec2.dist(p, center);
            vec2.sub(sub, center, p);
            return vec2.fromValues(sub[0] / distance * 20 * (1 - distance / scale_dist), sub[1] / distance * 20 * (1 - distance / scale_dist));

        }
        else {
            console.log("gravity");
            return vec2.fromValues(0, 0.981);
        }
    }

    private drawForceField() {
        let border_field = vec2.fromValues(this.screen_width * 0.3, this.screen_height * 0.2);
        let center_hole = vec2.fromValues(this.screen_width / 2, this.screen_height / 2);
        let scale_dist = vec2.dist(border_field, center_hole);

        for (let y = 50; y <= this.screen_height; y += 50)
            for (let x = 50; x <= this.screen_width; x += 50) {
                if (x > this.screen_width * 0.3 && x < this.screen_width * 0.7 && y > this.screen_height * 0.2 && y < this.screen_height * 0.8) {
                    let sub: vec2 = vec2.fromValues(0, 0);
                    let p: vec2 = vec2.fromValues(x, y);
                    let center = vec2.fromValues(this.screen_width / 2, this.screen_height / 2);
                    //@ts-ignore
                    let distance = vec2.dist(p, center);
                    vec2.sub(sub, center, p);

                    let c = new Graphics();
                    c = new Graphics();
                    c.beginFill(0xFF0000)
                    c.drawCircle(x, y, 3);


                    c.lineStyle(1, 0xFF0000, 1)
                        .moveTo(x, y)
                        .lineTo(x + sub[0] / distance * 20 * (1 - distance / scale_dist), y + sub[1] / distance * 20 * (1 - distance / scale_dist));
                    c.endFill();
                    this.addChild(c);
                }
                else {

                    let c = new Graphics();
                    c.beginFill(0xffffff)
                    c.drawCircle(x, y, 3);


                    c.lineStyle(1, 0xffffff, 1)
                        .moveTo(x, y)
                        .lineTo(x, y + 20);
                    c.endFill();
                    this.addChild(c);
                }
            }
    }

    update = (_dt: number): void => {
        let force_vec = this.getForce(this.circle.getGlobalPosition().x, this.circle.getGlobalPosition().y); 
        vec2.add(this.velocity, this.velocity, force_vec);
        this.circle.x +=  this.velocity[0] * _dt / 1000;
        this.circle.y +=  this.velocity[1] *_dt / 1000;
    }
}