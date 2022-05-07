//@ts-nocheck
import { Container, Sprite, Matrix } from "pixi.js";

export class SceneHierarchy extends Container {

    root: Sprite;
    child_1: Sprite;
    child_2: Sprite;

    constructor(screen_width: number, screen_heigth: number) {
        super();
        this.root = Sprite.from("tetanus-37.png");
        this.root.interactive  = true;
        this.root.transform.localTransform.set(
            0,0, screen_width /2,
            0,0, screen_heigth /2,
            0,0,1
        );
        
        // this.root.transform.position.x = screen_width /2;
        // this.root.transform.position.y = screen_heigth /2;
        // this.root.transform.scale.x = 0.1;
        // this.root.transform.scale.y = 0.1;
        
        // this.child_1 = Sprite.from("tetanus-37.png");
        // this.child_1.x = screen_width / 2 + 10;
        // this.child_1.y = screen_width / 2;
        // this.child_1.scale.x = 0.1;
        // this.child_1.scale.y = 0.1;
        // this.child_1.interactive = true;
        
        // this.child_2 = Sprite.from("tetanus-37.png");
        // this.child_2.x = screen_width / 2 + 20;
        // this.child_2.y = screen_width / 2 + 20;
        // this.child_2.scale.x = 0.1;
        // this.child_2.scale.y = 0.1;
        // this.child_2.interactive = true;

        this.addChild(this.root);
    }
}