import { Container, InteractionEvent, Sprite } from "pixi.js";

export class Scene extends Container {
   
    // We promoted clampy to a member of the class
    private slingshot: Sprite;
    private player: Sprite;
    private floor: Sprite;
    constructor(screenWidth: number, screenHeight: number) {
        super();

        //floor
        this.floor = Sprite.from("floor.png");
        //this.floor.anchor.set(0.5);
        this.floor.width = screenWidth;
        this.floor.scale.y = 0.05;
        //this.floor.x = 150;
        this.floor.y = screenHeight - 100;
        this.floor.interactive = true;
        this.floor.on("click", this.drawLine);
        this.addChild(this.floor);

        //slingshot
        this.slingshot = Sprite.from("slingshot.png");
        this.slingshot.anchor.set(0.5);
        this.slingshot.scale.x = 0.08;
        this.slingshot.scale.y = 0.08;
        this.slingshot.x = 200;
        this.slingshot.y = screenHeight - 130;
        this.slingshot.interactive = true;
        this.slingshot.on("click", this.drawLine);
        this.addChild(this.slingshot);

        //player
        this.player = Sprite.from("player.png");
        this.player.anchor.set(0.5);
        this.player.scale.x = 0.1;
        this.player.scale.y = 0.1;
        this.player.x = 100;
        this.player.y = screenHeight - 50;
        this.player.interactive = true;
        this.addChild(this.player);

    }
    private drawLine(e: InteractionEvent): void {


        console.log("Slingshot pressed");
        console.log("The data of your interaction is super interesting", e)
    }
}