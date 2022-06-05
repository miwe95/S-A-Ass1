import { vec2 } from "gl-matrix";
import { Container, Graphics } from "pixi.js";

export class ParticleDynamicsDrawer extends Container {

    //@ts-ignore
    private screen_width: number;
    //@ts-ignore
    private screen_height: number;
    constructor(screenWidth: number, screenHeigth: number) {
        super();
        this.screen_width = screenWidth;
        this.screen_height = screenHeigth;
    }
    //@ts-ignore
    drawForceField = (): void => {
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
    removeForceField() {
        this.removeChildren();
    }
}