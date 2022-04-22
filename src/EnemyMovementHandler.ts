import {Container, Graphics, Sprite } from "pixi.js";
import * as Vec2D from 'vector2d';

export class EnemyMovementHandler extends Container{
    private enemy: Sprite;
    private spline_points: Vec2D.Vector [];
    //private ticker: Ticker;

    constructor(_screenWidth: number, _screenHeight: number){
        super();
        this.enemy = Sprite.from("enemy.png");
        this.enemy.anchor.set(0.6);
        this.enemy.scale.x = 0.15;
        this.enemy.scale.y = 0.15;
        this.enemy.x = 100;
        this.enemy.y = 200;
        this.enemy.interactive = true;
        this.addChild(this.enemy);
        this.spline_points = [];
        this.spline_points.push(new Vec2D.Vector(100, 200));
        this.spline_points.push(new Vec2D.Vector(200, 200));
        this.spline_points.push(new Vec2D.Vector(400, 300));
        this.spline_points.push(new Vec2D.Vector(500, 400));
        this.drawSplines();
    }

    private drawSplines(){
        this.spline_points.forEach(point => {
            console.log(point.x);
            console.log(point.y);
            let circle = new Graphics();
            circle.beginFill(0xe74c3c); // Red
            this.addChild(circle);
            circle.drawCircle(point.x, point.y, 8);

        })
    }
}