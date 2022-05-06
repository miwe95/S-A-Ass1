//@ts-nocheck
import { Container, Sprite } from "pixi.js";
import { Vector } from "vector2d";


export class RigidBody extends Container {

    private rb_object: Sprite;
    private mass: number;
    private Inertia: number;
    private linear_velocity: Vector;
    private angular_velocity: number;
    private torque: number;
    private force: Vector;
    private screenheigth: number;



    constructor(screenWidth: number, screenHeight: number) {
        super();
        this.screenheigth = screenHeight;
        this.rb_object = Sprite.from("rb_object.png");
        this.rb_object.anchor.set(0.5);
        this.rb_object.scale.x = 0.3;
        this.rb_object.scale.y = 0.3;
        this.rb_object.x = screenWidth / 2;
        this.rb_object.y = screenHeight / 2;
        this.rb_object.interactive = true;
        this.mass = 10;
        this.linear_velocity = new Vector(0, 0);
        this.angular_velocity = 0;
        this.torque = 0;
        this.force = new Vector(0, 9.8);
        this.Inertia = 0;
        this.addChild(this.rb_object);

    }

    update = (dt: number): void => {

        this.linear_velocity.x = this.force.x / this.mass;
        this.linear_velocity.y = this.force.y / this.mass;

        this.rb_object.x += this.linear_velocity.x * dt / 10;
        this.rb_object.y += this.linear_velocity.y * dt / 10;
        //console.log(this.rb_object.y);
        //console.log(this.screenheigth);

        if(this.rb_object.y >= this.screenheigth - 50){
            this.force.y = 0;
        }
    }

}
