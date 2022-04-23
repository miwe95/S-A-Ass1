import { Container, Graphics, InteractionEvent, Sprite, Ticker } from "pixi.js";
import { cGraphics } from "./Utils";
import { app } from "./Index";

export class EnemyMovementHandler extends Container {
    private enemy: Sprite;
    private control_points: cGraphics[];
    private catmull_points: cGraphics[];
    private ticker: Ticker;
    private move_counter: number;
    private x_coord: number;
    private y_coord: number;
    private clicked_point: Graphics;


    //private ticker: Ticker;

    constructor(_screenWidth: number, _screenHeight: number) {
        super();
        this.x_coord = 0;
        this.y_coord = 0;
        this.move_counter = 0;
        this.clicked_point = new Graphics();

        this.catmull_points = [];
        this.control_points = [];

        this.control_points.push(new cGraphics(0.1 * _screenWidth, 0.1 * _screenHeight, true));
        this.control_points.push(new cGraphics(0.4 * _screenWidth, 0.3 * _screenHeight, true));
        this.control_points.push(new cGraphics(0.2 * _screenWidth, 0.4 * _screenHeight, true));
        this.control_points.push(new cGraphics(0.2 * _screenWidth, 0.25 * _screenHeight, true));

        this.calculateCatMull();
        this.calculateControlPoints();

        this.enemy = Sprite.from("enemy.png");
        this.enemy.anchor.set(0.6);
        this.enemy.scale.x = 0.15;
        this.enemy.scale.y = 0.15;
        this.enemy.x = this.control_points[0].x;
        this.enemy.y = this.control_points[0].y;
        this.enemy.interactive = true;
        this.addChild(this.enemy);

        this.ticker = new Ticker();
        this.ticker.autoStart = false;
        this.ticker.maxFPS = 60;
        this.ticker.add(this.update);
        this.ticker.start();

    }

    private calculateControlPoints() {
        for (var graphic of this.control_points) {
            graphic.on("mousedown", this.selectPoint);
            graphic.on("mouseup", this.releasePoint);
            this.drawPoint(graphic, 0xeb4034, 6);
        }
    }

    private calculateCatMull() {
        for (let i = 0.02; i <= 0.98; i += 0.01) {
            this.x_coord = this.catMullRom(i, this.control_points[0].x, this.control_points[1].x, this.control_points[2].x, this.control_points[3].x);
            this.y_coord = this.catMullRom(i, this.control_points[0].y, this.control_points[1].y, this.control_points[2].y, this.control_points[3].y);
            this.catmull_points.push(new cGraphics(this.x_coord, this.y_coord, true));
        }
        for (let i = 0.02; i <= 0.98; i += 0.01) {
            this.x_coord = this.catMullRom(i, this.control_points[1].x, this.control_points[2].x, this.control_points[3].x, this.control_points[0].x);
            this.y_coord = this.catMullRom(i, this.control_points[1].y, this.control_points[2].y, this.control_points[3].y, this.control_points[0].y);
            this.catmull_points.push(new cGraphics(this.x_coord, this.y_coord, true));
        }

        for (let i = 0.02; i <= 0.98; i += 0.01) {
            this.x_coord = this.catMullRom(i, this.control_points[2].x, this.control_points[3].x, this.control_points[0].x, this.control_points[1].x);
            this.y_coord = this.catMullRom(i, this.control_points[2].y, this.control_points[3].y, this.control_points[0].y, this.control_points[1].y);
            this.catmull_points.push(new cGraphics(this.x_coord, this.y_coord, true));
        }

        for (let i = 0.02; i <= 0.98; i += 0.01) {
            this.x_coord = this.catMullRom(i, this.control_points[3].x, this.control_points[0].x, this.control_points[1].x, this.control_points[2].x);
            this.y_coord = this.catMullRom(i, this.control_points[3].y, this.control_points[0].y, this.control_points[1].y, this.control_points[2].y);
            this.catmull_points.push(new cGraphics(this.x_coord, this.y_coord, true));
        }

        for (var graphic of this.catmull_points)
            this.drawPoint(graphic, 0xe3e1e1, 4);
    }

    private update = (): void => {
        if (this.move_counter >= this.catmull_points.length) {
            this.move_counter = 0;
        }

        this.enemy.x = this.catmull_points[this.move_counter].x;
        this.enemy.y = this.catmull_points[this.move_counter].y;
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
    private drawPoint(graphic: Graphics, color: number, thickness: number) {
        graphic.beginFill(color); // Red
        graphic.drawCircle(0, 0, thickness);
        this.addChild(graphic);
    }

    private selectPoint = (_e: InteractionEvent): void => {
        console.log(_e.target);
        console.log(app);
        this.clicked_point = _e.target as Graphics;
        this.clicked_point.on("mousemove", this.movePoint);
    }

    private movePoint = (_e: InteractionEvent): void => {

        console.log("move");
        if (this.clicked_point) {
            this.clicked_point.x = _e.data.global.x;
            this.clicked_point.y = _e.data.global.y;
            for (var g of this.catmull_points) {
                this.removeChild(g);
            }
            this.catmull_points = [];
            this.calculateCatMull();
        }
        else {
            for (let c of this.control_points) {
                c.removeListener("mousemove");
                this.removeChild(c);
            }
            this.calculateControlPoints();
        }
    }

    private releasePoint = (_e: InteractionEvent): void => {
        _e.target.removeListener("mousemove");
    }
}