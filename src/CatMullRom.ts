import { Container, Graphics, InteractionEvent, Sprite, Ticker } from "pixi.js";
import { cGraphics } from "./Utils";

export class CatMullRom extends Container {
    private enemy: Sprite;
    private control_points: cGraphics[];
    private catmull_points: cGraphics[];
    private ticker: Ticker;
    private move_counter: number;
    private selected_point: Graphics;

    constructor(_screenWidth: number, _screenHeight: number) {
        super();
        this.move_counter = 0;
        this.selected_point = new Graphics();

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
            this.drawPoint(graphic, 0xeb4034, 9);
        }
    }

    private reDrawControlPoints(){
        for (var graphic of this.control_points) {
            graphic.removeListener("mousemove");
            this.removeChild(graphic);
            this.drawPoint(graphic, 0xeb4034, 9);
        }
    }

    private calculateCatMull() {
        let x_coord = 0;
        let y_coord = 0;
        
        for (let i = 0; i <= 1; i += 0.01) {
            x_coord = this.catMullRom(i, this.control_points[0].x, this.control_points[1].x, this.control_points[2].x, this.control_points[3].x);
            y_coord = this.catMullRom(i, this.control_points[0].y, this.control_points[1].y, this.control_points[2].y, this.control_points[3].y);
            this.catmull_points.push(new cGraphics(x_coord, y_coord, true));
        }
        for (let i = 0; i <= 1; i += 0.01) {
            x_coord = this.catMullRom(i, this.control_points[1].x, this.control_points[2].x, this.control_points[3].x, this.control_points[0].x);
            y_coord = this.catMullRom(i, this.control_points[1].y, this.control_points[2].y, this.control_points[3].y, this.control_points[0].y);
            this.catmull_points.push(new cGraphics(x_coord, y_coord, true));
        }

        for (let i = 0; i <= 1; i += 0.01) {
            x_coord = this.catMullRom(i, this.control_points[2].x, this.control_points[3].x, this.control_points[0].x, this.control_points[1].x);
            y_coord = this.catMullRom(i, this.control_points[2].y, this.control_points[3].y, this.control_points[0].y, this.control_points[1].y);
            this.catmull_points.push(new cGraphics(x_coord, y_coord, true));
        }

        for (let i = 0; i <= 1; i += 0.01) {
            x_coord = this.catMullRom(i, this.control_points[3].x, this.control_points[0].x, this.control_points[1].x, this.control_points[2].x);
            y_coord = this.catMullRom(i, this.control_points[3].y, this.control_points[0].y, this.control_points[1].y, this.control_points[2].y);
            this.catmull_points.push(new cGraphics(x_coord, y_coord, true));
        }

        for (var graphic of this.catmull_points)
        {
            this.drawPoint(graphic, 0xe3e1e1, 3);
            graphic.on("mouseup", this.releasePoint);
        }
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
        this.selected_point = _e.target as Graphics;
        this.selected_point.on("mousemove", this.movePoint);
        this.selected_point.on("mouseup", this.releasePoint);
    }

    private movePoint = (_e: InteractionEvent): void => {
        if (this.selected_point) {
            this.selected_point.x = _e.data.global.x;
            this.selected_point.y = _e.data.global.y;
            for (var g of this.catmull_points) {
                this.removeChild(g);
            }
            this.catmull_points = [];
            this.calculateCatMull();
          
        }
    }

    private releasePoint = (_e: InteractionEvent): void => {
        this.selected_point.removeListener("mousemove");
        this.reDrawControlPoints();
    }
}