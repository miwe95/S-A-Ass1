import { Graphics } from "pixi.js";

export class cGraphics extends Graphics {
    constructor(_x: number, _y: number, _interactive: boolean) {
        super();
        this.x = _x;
        this.y = _y;
        this.interactive = _interactive;
    }
}