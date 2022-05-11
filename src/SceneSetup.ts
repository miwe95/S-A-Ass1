import { Container, Sprite } from "pixi.js";

export class SceneSetup extends Container {

    private floor: Sprite;
    private rock: Sprite;

    constructor(screenWidth: number, screenHeight: number) {
        super();
        //floor
        this.floor = Sprite.from("floor.png");
        this.floor.width = screenWidth;
        this.floor.scale.y = 0.05;
        this.floor.y = screenHeight - 100;
        this.addChild(this.floor);

        this.rock = Sprite.from("rock.png");
        this.rock.y = screenHeight - 60;
        this.rock.x = 200;

        this.rock.scale.set(0.1);
        this.addChild(this.rock);
    }
}