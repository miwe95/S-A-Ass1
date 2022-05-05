import { Container,InteractionEvent, Sprite, Ticker } from "pixi.js";

export class RigidBody extends Container { 
   
    private rb_object: Sprite;
    private ticker: Ticker;
    

   constructor(screenWidth: number, screenHeight: number)
   {
    super();
    this.rb_object = Sprite.from("rb_object.png");
    this.rb_object.anchor.set(0.5);
    this.rb_object.scale.x = 0.3;
    this.rb_object.scale.y = 0.3;
    this.rb_object.x = screenWidth / 2;
    this.rb_object.y = screenHeight / 2;
    this.rb_object.interactive = true;
    this.addChild(this.rb_object);

    this.rb_object.on("mousedown", this.dragObject);

    this.ticker = new Ticker();
    this.ticker.autoStart = false;
    this.ticker.maxFPS = 60;
    this.ticker.add(this.update);
    this.ticker.start();
    }

    private update = (): void => {
        this.rb_object.y += 2;
    }

    private clearListenerObject = (_e: InteractionEvent): void => {
        this.rb_object.removeListener("mousemove");
        this.ticker.start();
    }

    private moveObject = (e: InteractionEvent): void => {
        this.rb_object.x = e.data.global.x;
        this.rb_object.y = e.data.global.y;
    }

    private dragObject = (_e: InteractionEvent): void => {
        this.ticker.stop();
        this.rb_object.on("mousemove", this.moveObject);
        this.rb_object.on("mouseup", this.clearListenerObject);

    }

}
