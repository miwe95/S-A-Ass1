
import { Container, Sprite } from "pixi.js";
import { Vector } from "vector2d";


export class RigidBody extends Container {

    private rb_object: Sprite;
    //@ts-ignore
    private mass: number;
    //@ts-ignore
    private Inertia: number;
    linear_velocity: Vector;
    //@ts-ignore
    private angular_velocity: number;
    //@ts-ignore
    private torque: number;

    private screenheigth: number;
    //@ts-ignore
    private screenwidth: number;
    //@ts-ignore
    private gravity: boolean;
    move_: boolean;
    private gravity_value: number;
    private shooting_time: number;
    private acceleration: number;

    constructor(screenWidth: number, screenHeight: number, object: Sprite) {
        super();
        this.screenheigth = screenHeight;
        this.screenwidth = screenWidth;
        this.rb_object = object;
        this.mass = 0.5;
        this.linear_velocity = new Vector(10, 10);
        this.angular_velocity = 0;
        this.torque = 0;
        this.Inertia = 0;
        this.gravity = true;
        this.shooting_time = 0;
        this.acceleration = 0;
        this.move_ = false;
        this.gravity_value = 9.81;

        //this.linear_velocity.x = this.force.x / this.mass;
        //this.linear_velocity.y = this.force.y / this.mass;
    }

    addGravity(dt: number) {
        this.shooting_time += dt;
        this.acceleration = (Math.pow(this.shooting_time / 1000, 2) - Math.pow(this.shooting_time / 1000 - dt / 1000, 2)) * this.gravity_value / 2;
    }

    resetPlayerVars(){
        this.gravity = false;
        this.move_ = false;
        this.shooting_time = 0;
    }

    move = (dt: number): void => {
    
    
        if (this.move_) {
            this.gravity = true;
            if (this.rb_object.y >= this.screenheigth - 50) {
                this.resetPlayerVars();
            }
            else {
                //console.log("dt: " + dt);
                this.addGravity(dt);
                this.rb_object.x += (this.linear_velocity.x * dt / 1000) * 100;
                this.rb_object.y -= ((this.linear_velocity.y * dt / 1000) - this.acceleration) * 100;
                //console.log(this.rb_object.y);
            }
        }
    }
}
