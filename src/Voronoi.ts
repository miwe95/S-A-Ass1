import { vec2 } from "gl-matrix";
import { Container, Graphics, InteractionEvent } from "pixi.js";

export class Voronoi extends Container {
    private circle: Graphics;
    private screen_width: number;
    private screen_height: number;
    private cells: Map<vec2, Array<vec2>>;
    private impact_point: vec2;


    constructor(_screenWidth: number, _screenHeight: number) {
        super();
        this.screen_width = _screenWidth;
        this.screen_height = _screenHeight;


        this.cells = new Map();
        this.impact_point = vec2.fromValues(0, 0);
        this.circle = new Graphics();
        this.circle.beginFill(0xffffff);
        this.circle.drawCircle(_screenWidth * 0.5, _screenHeight * 0.1, 100);
        this.circle.endFill();
        this.circle.interactive = true;
        this.addChild(this.circle);
        //console.log(this.generateRandomColor());
        this.circle.on("click", this.breakCircle);

    }

    breakCircle = (_e: InteractionEvent) => {

        //console.log(this.impact_point);
        this.impact_point = vec2.fromValues(_e.data.global.x, _e.data.global.y);
        this.calculateSeedPoints();
        this.calculateCells();
        this.drawCells();
    }

    update(_dt: number) {
        //this.circle.y += 100 * _dt / 1000;
    }

    private generateRandomColor() {
        //@ts-ignore
        return '0x' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0') as number;
    }

    private drawPoint(x: number, y: number, color: number = 0x999999) {
        this.circle.beginFill(color);
        this.circle.drawCircle(x, y, 1);
        this.circle.endFill();
    }

    //@ts-ignore
    private drawCells() {
        for (let cell of this.cells.keys()) {
            let current_color = this.generateRandomColor();
            for (let point of this.cells.get(cell)!) {
                this.drawPoint(point[0], point[1], current_color);
            }
        }
    }

    private calculateCells() {
        let closest_cell_center = vec2.fromValues(100000, 100000);

        for (let y = this.screen_height * 0.1 - 100; y < this.screen_height * 0.1 + 100; y++)
            for (let x = this.screen_width * 0.5 - 100; x < this.screen_width * 0.5 + 100; x++) {
                //find closest cell
                let current_position = vec2.fromValues(x, y);
                let point_center = vec2.fromValues(this.screen_width * 0.5, this.screen_height * 0.1);

                if (vec2.distance(current_position, point_center) < 100) {
                    for (let cell_center of this.cells.keys()) {
                        let current_position = vec2.fromValues(x, y);
                        if (vec2.distance(cell_center, current_position) < vec2.distance(current_position, closest_cell_center)) {
                            closest_cell_center = cell_center;
                        }
                    }
                    //add points to closest cell
                    this.cells.get(closest_cell_center)?.push(vec2.fromValues(x, y));
                    closest_cell_center = vec2.fromValues(100000, 100000);
                }


            }
    }

    private calculateSeedPoints() {

        let point_center = vec2.fromValues(this.screen_width * 0.5, this.screen_height * 0.1);

        //50px around impact
        for (let i = 0; i < 25; i++) {
            let u = Math.random();
            let v = Math.random();
            let w = 50 * Math.sqrt(u);
            let t = 2 * Math.PI * v;
            let x = w * Math.cos(t)
            let y = w * Math.sin(t)
            this.cells.set(vec2.fromValues(this.impact_point[0] + x,this.impact_point[1] + y), []);
            this.drawPoint(point_center[0] + x, point_center[1] + y);
        }

        //100px around center
        for (let i = 0; i < 10; i++) {
            let u = Math.random();
            let v = Math.random();
            let w = 100 * Math.sqrt(u);
            let t = 2 * Math.PI * v;
            let x = w * Math.cos(t)
            let y = w * Math.sin(t)
            this.cells.set(vec2.fromValues(point_center[0] + x,point_center[1] + y), []);
            this.drawPoint(point_center[0] + x, point_center[1] + y);
        }
    }
}