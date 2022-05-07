import { Sprite } from "pixi.js";

export class Collision{
    o1: Sprite;
    o2: Sprite;

    constructor(o1: Sprite, o2: Sprite) {
        this.o1 = o1;
        this.o2 = o2;
    }
}