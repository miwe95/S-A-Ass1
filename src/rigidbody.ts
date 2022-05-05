import { Container,InteractionEvent, Sprite, Ticker, DisplayObject } from "pixi.js";

export class RigidBody extends Container { 
   
    private rb_object: Sprite;
    private ticker: Ticker;
    private rb_object_static: Sprite
    

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

    this.rb_object_static = Sprite.from("rb_object.png");
    this.rb_object_static.anchor.set(0.5);
    this.rb_object_static.scale.x = 0.6;
    this.rb_object_static.scale.y = 0.2;
    this.rb_object_static.x = screenWidth / 2;
    this.rb_object_static.y = (screenHeight / 2) + 200;
    this.rb_object_static.interactive = true;
    this.addChild(this.rb_object_static);

    this.rb_object.on("mousedown", this.dragObject);

    this.ticker = new Ticker();
    this.ticker.autoStart = false;
    this.ticker.maxFPS = 60;
    this.ticker.add(this.update);
    this.ticker.start();
    }

    private update = (): void => {

        if (!this.checkCollision(this.rb_object, this.rb_object_static)) {
            this.rb_object.y += 2;
        }
    }

    private checkCollision(objA: DisplayObject, objB: DisplayObject): boolean {
        const a = objA.getBounds();
        const b = objB.getBounds();
    
        const rightmostLeft = a.left < b.left ? b.left : a.left;
        const leftmostRight = a.right > b.right ? b.right : a.right;
    
        if (leftmostRight <= rightmostLeft) {
            return false;
        }
    
        const bottommostTop = a.top < b.top ? b.top : a.top;
        const topmostBottom = a.bottom > b.bottom ? b.bottom : a.bottom;
    
        return  topmostBottom > bottommostTop;
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
