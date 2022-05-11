import { Container, Graphics, InteractionEvent, Sprite } from "pixi.js";
import { RigidBody } from "./rigidbody";


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
        this.rigid_body= new RigidBody(_screenWidth,screenHeight,this.player);

    }

    //Called when Ticker starts
    update = (dt: number): void => {
        this.rigid_body.move(dt);
    }

    //Called when left mousebutton is released
    private firePlayer = (_e: InteractionEvent): void => {
        this.clearListenerPlayerFire(_e);
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
        this.player.on("mousemove", this.moveRopeAndPlayer);
        this.player.on("mouseup", this.firePlayer);
        this.slingshot.on("mouseup", this.firePlayer);
    }


}