import { Container, Graphics, Sprite, Ticker } from "pixi.js";
import * as Vec2D from 'vector2d';

export class EnemyMovementHandler extends Container {
    private enemy: Sprite;
    private spline_points: Vec2D.Vector[];
    private catmull_points: Vec2D.Vector[];
    private ticker: Ticker;
    private move_counter: number;
    private x_coord: number;
    private y_coord: number;
    //private ticker: Ticker;

    constructor(_screenWidth: number, _screenHeight: number) {
        super();
        this.x_coord = 0;
        this.y_coord = 0;
        this.spline_points = [];
        this.catmull_points = [];
        this.spline_points.push(new Vec2D.Vector(0.1 * _screenWidth, 0.1 * _screenHeight));
        this.spline_points.push(new Vec2D.Vector(0.4 * _screenWidth, 0.3 * _screenHeight));
        this.spline_points.push(new Vec2D.Vector(0.2 * _screenWidth, 0.4 * _screenHeight));
        this.spline_points.push(new Vec2D.Vector(0.2 * _screenWidth, 0.25 * _screenHeight));
        this.drawPoints();
        this.move_counter = 0;

        for (let i = 0.01; i <= 0.99; i += 0.01) {
            this.x_coord = this.catMullRom(i, this.spline_points[0].x, this.spline_points[1].x, this.spline_points[2].x, this.spline_points[3].x);
            this.y_coord = this.catMullRom(i, this.spline_points[0].y, this.spline_points[1].y, this.spline_points[2].y, this.spline_points[3].y);
            this.drawPoint(this.x_coord, this.y_coord);
            this.catmull_points.push(new Vec2D.Vector(this.x_coord, this.y_coord));
        }
        for (let i = 0.01; i <= 0.99; i += 0.01) {
            this.x_coord = this.catMullRom(i, this.spline_points[1].x, this.spline_points[2].x, this.spline_points[3].x, this.spline_points[0].x);
            this.y_coord = this.catMullRom(i, this.spline_points[1].y, this.spline_points[2].y, this.spline_points[3].y, this.spline_points[0].y);
            this.drawPoint(this.x_coord, this.y_coord);
            this.catmull_points.push(new Vec2D.Vector(this.x_coord, this.y_coord));
        }

        for (let i = 0.01; i <= 0.99; i += 0.01) {
            this.x_coord = this.catMullRom(i, this.spline_points[2].x, this.spline_points[3].x, this.spline_points[0].x, this.spline_points[1].x);
            this.y_coord = this.catMullRom(i, this.spline_points[2].y, this.spline_points[3].y, this.spline_points[0].y, this.spline_points[1].y);
            this.drawPoint(this.x_coord, this.y_coord);
            this.catmull_points.push(new Vec2D.Vector(this.x_coord, this.y_coord));
        }

        for (let i = 0.01; i <= 0.99; i += 0.01) {
            this.x_coord = this.catMullRom(i, this.spline_points[3].x, this.spline_points[0].x, this.spline_points[1].x, this.spline_points[2].x);
            this.y_coord = this.catMullRom(i, this.spline_points[3].y, this.spline_points[0].y, this.spline_points[1].y, this.spline_points[2].y);
            this.drawPoint(this.x_coord, this.y_coord);
            this.catmull_points.push(new Vec2D.Vector(this.x_coord, this.y_coord));
        }


        this.enemy = Sprite.from("enemy.png");
        this.enemy.anchor.set(0.6);
        this.enemy.scale.x = 0.15;
        this.enemy.scale.y = 0.15;
        this.enemy.x = this.spline_points[0].x;
        this.enemy.y = this.spline_points[0].y;
        this.enemy.interactive = true;
        this.addChild(this.enemy);

        this.ticker = new Ticker();
        this.ticker.autoStart = false;
        this.ticker.maxFPS = 60;
        this.ticker.add(this.update);
        this.ticker.start();
    }

    private update = (): void => {
        if (this.move_counter >= this.catmull_points.length) {
            this.move_counter = 0;
        }

        this.enemy.x = this.catmull_points[this.move_counter].x;
        this.enemy.y = this.catmull_points[this.move_counter].y;
        console.log(this.move_counter);
        this.move_counter += 1;
    };

    private catMullRom(t: number, p0: number, p1: number, p2: number, p3: number) {
        return 0.5 * (
            (2 * p1) +
            (-p0 + p2) * t +
            (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t +
            (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t
        );
    }
    private drawPoint(x: number, y: number) {
        let circle = new Graphics();
        circle.beginFill(0xEADDCA); // Red
        this.addChild(circle);
        circle.drawCircle(x, y, 4);
    }
    private drawPoints() {
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