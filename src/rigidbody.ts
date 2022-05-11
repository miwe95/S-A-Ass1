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
    //@ts-ignore
    private screenwidth: number;
    private gravity: boolean;
    private acceleration: Vector;
    move_: boolean;

    constructor(screenWidth: number, screenHeight: number, object: Sprite) {
        super();
        this.screenheigth = screenHeight;
        this.screenwidth = screenWidth;
        this.rb_object = object;
        this.mass = 0.5;
        this.linear_velocity = new Vector(0, 0);
        this.angular_velocity = 0;
        this.torque = 0;
        this.force = new Vector(0, 9.8);
        this.Inertia = 0;
        this.gravity = true;
        this.acceleration = new Vector(0, 0);
        this.move_ = false;

        this.rb_object.on("pointerdown", this.addForce);
        //this.linear_velocity.x = this.force.x / this.mass;
        //this.linear_velocity.y = this.force.y / this.mass;
    }

    addForce = (force: Vector): void => {
        // console.log("press");
        this.linear_velocity.x += force.x / this.mass;
        this.linear_velocity.y += force.y / this.mass;
    }

    addGravity(force: Vector, dt:number) {
        this.force.x += force.x * dt;
        this.force.y += force.y * dt;
        this.acceleration = new Vector(this.force.x / this.mass, this.force.y / this.mass);
    }

    move = (dt: number): void => {
        if (this.move_) {
            this.gravity = true;
            if (this.rb_object.y >= this.screenheigth - 50) {
                this.gravity = false;
                this.force.y = 0;
                this.force.x = 0;
                this.linear_velocity.x = 0;
                this.linear_velocity.y = 0;
                this.acceleration.x = 0;                
                this.acceleration.y = 0;    
                this.move_ = false;            

            }
            else {
                if (this.gravity) {
                    this.addGravity(new Vector(0, 9.81), dt);
                }
                this.addForce(new Vector(10, -20));
                this.linear_velocity.x += this.acceleration.x * dt / 1000;
                this.linear_velocity.y += this.acceleration.y * dt / 1000;

                this.rb_object.x += this.linear_velocity.x * dt / 1000;
                this.rb_object.y += this.linear_velocity.y * dt / 1000;
                //console.log(this.rb_object.y);
            }
        }
    }
}
