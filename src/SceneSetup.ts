import { Container, Sprite } from "pixi.js";

export class SceneSetup extends Container {

    private floor: Sprite;
    constructor(screenWidth: number, screenHeight: number) {
        super();
        //floor
        this.floor = Sprite.from("floor.png");
        this.floor.width = screenWidth;
        this.floor.scale.y = 0.05;
        this.floor.y = screenHeight - 100;
        this.addChild(this.floor);
    }
}