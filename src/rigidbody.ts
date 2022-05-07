import { Container, Sprite } from "pixi.js";
import { Vector } from "vector2d";


export class RigidBody extends Container {

    private rb_object: Sprite;
    private mass: number;
    //@ts-ignore
    private Inertia: number;
    private linear_velocity: Vector;
    //@ts-ignore
    private angular_velocity: number;
    //@ts-ignore
    private torque: number;
    private force: Vector;
    private screenheigth: number;
    private gravity: boolean;
    private acceleration: Vector;

    constructor(screenWidth: number, screenHeight: number) {
        super();
        this.screenheigth = screenHeight;
        this.rb_object = Sprite.from("rb_object.png");
        this.rb_object.anchor.set(0.5);
        this.rb_object.scale.x = 0.3;
        this.rb_object.scale.y = 0.3;
        this.rb_object.x = 0.25 * screenWidth;
        this.rb_object.y = 0.75 * screenHeight;
        this.rb_object.interactive = true;
        this.mass = 0.5;
        this.linear_velocity = new Vector(0, 0);
        this.angular_velocity = 0;
        this.torque = 0;
        this.force = new Vector(0, 9.8);
        this.Inertia = 0;
        this.addChild(this.rb_object);
        this.gravity = true;
        this.acceleration = new Vector(0,0);

        this.rb_object.on("pointerdown", this.addForce);
        //this.linear_velocity.x = this.force.x / this.mass;
        //this.linear_velocity.y = this.force.y / this.mass;
    }

    addForce = (force: Vector): void => {
        console.log("press");
        this.linear_velocity.x += force.x / this.mass;
        this.linear_velocity.y += force.y / this.mass;
    }

    private addGravity(force: Vector) {
        this.force.x += force.x;
        this.force.y += force.y;
        this.acceleration = new Vector(this.force.x / this.mass, this.force.y / this.mass);
    }

    update = (dt: number): void => {

        //console.log(this.screenheigth);
        
        if (this.rb_object.y >= this.screenheigth - 50) {
            this.gravity = false;
            this.force.y = 0;
        }
        else{
            if (this.gravity) {
                this.addGravity(new Vector(0, 9.81));
            }
            this.addForce(new Vector(1, -10));
            this.linear_velocity.x += this.acceleration.x * dt / 1000;
            this.linear_velocity.y += this.acceleration.y * dt / 1000;
    
            this.rb_object.x += this.linear_velocity.x * dt / 1000;
            this.rb_object.y += this.linear_velocity.y * dt / 1000;
            //console.log(this.rb_object.y);
        }
    }

}
