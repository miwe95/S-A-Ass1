import { vec2 } from "gl-matrix";
import { Container, Graphics, InteractionEvent } from "pixi.js";

//@ts-ignore
var perlin = require("./perlin.js");

export class Voronoi extends Container {
    private circle: Graphics;
    private screen_width: number;
    private screen_height: number;
    private cells: Map<vec2, Array<vec2>>;
    private impact_point: vec2;
    private radius: number;
    show_distance_field:boolean;


    constructor(_screenWidth: number, _screenHeight: number) {
        super();
        this.screen_width = _screenWidth;
        this.screen_height = _screenHeight;
        this.radius = 100;
        this.show_distance_field = false;

        this.cells = new Map();
        this.impact_point = vec2.fromValues(0, 0);
        this.circle = new Graphics();
        this.circle.beginFill(0xffffff);
        this.circle.drawCircle(_screenWidth * 0.5, _screenHeight * 0.1, this.radius);
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
    }

    update(_dt: number) {
        //this.circle.y += 100 * _dt / 1000;
    }

    //@ts-ignore
    private generateRandomColor() {
        //@ts-ignore
        return '0x' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0') as number;
    }

    private drawPoint(x: number, y: number, color: number = 0x999999) {
        this.circle.beginFill(color);
        this.circle.drawCircle(x, y, 1);
        this.circle.endFill();
    }

    private findClosestPoints(current_position: vec2): Array<vec2> {
        let closest_cell_center = vec2.fromValues(100000, 100000);
        let second_closest_cell_center = vec2.fromValues(100000, 100000);
        for (let cell_center of this.cells.keys()) {
            if (vec2.distance(cell_center, current_position) < vec2.distance(current_position, closest_cell_center)) {
                second_closest_cell_center = closest_cell_center;
                closest_cell_center = cell_center;
            }
        }
        return [closest_cell_center, second_closest_cell_center];
    }

    //@ts-ignore
    private colorDistanceField(d: number, current_position: vec2) {
        if (d > 1 && d <= 10) {
            this.drawPoint(current_position[0], current_position[1], 0xf54242)
        }
        else if (d > 10 && d <= 20) {
            this.drawPoint(current_position[0], current_position[1], 0xf58d42)
        }
        else if (d > 20 && d <= 50) {
            this.drawPoint(current_position[0], current_position[1], 0xf5da42)
        }
        else if (d > 50 && d <= 100) {
            this.drawPoint(current_position[0], current_position[1], 0xcbf542)
        }
        else if (d > 100) {
            this.drawPoint(current_position[0], current_position[1], 0x4272f5)
        }
    }

    private calculateCells() {
        let point_center = vec2.fromValues(Math.round(this.screen_width * 0.5), Math.round(this.screen_height * 0.1));
        let current_position: vec2 = vec2.fromValues(0, 0);
        //console.log(perlin.noise.seed(Math.random()));
    
        for (let y = point_center[1] - this.radius; y < point_center[1] + this.radius; y++)
            for (let x = point_center[0] - this.radius; x < point_center[0] + this.radius; x++) {

                current_position = vec2.fromValues(x, y);
                 
                if (vec2.distance(current_position, point_center) < this.radius) {
                    let closest_points = this.findClosestPoints(current_position);
                    let closest_cell_center = closest_points[0];
                    let second_closest_cell_center = closest_points[1];

                    let m: vec2 = vec2.fromValues(0, 0);
                    vec2.add(m, second_closest_cell_center, closest_cell_center);
                    m[0] = (m[0] / 2);
                    m[1] = (m[1] / 2);

                    //this.drawPoint(m[0], m[1], 0xFF99FF)

                    let x_m: vec2 = vec2.fromValues(0, 0);
                    let pb_pa: vec2 = vec2.fromValues(0, 0);

                    vec2.sub(x_m, current_position, m);
                    vec2.sub(pb_pa, second_closest_cell_center, closest_cell_center);
                    let pb_pa_abs = vec2.distance(second_closest_cell_center, closest_cell_center);
                    let pb_pa_div: vec2 = vec2.fromValues(0, 0);
                    pb_pa_div[0] = (pb_pa[0] / pb_pa_abs);
                    pb_pa_div[1] = (pb_pa[1] / pb_pa_abs);

                    let d: number = vec2.dot(x_m, pb_pa_div);
                    //var value = perlin.noise.simplex2(x / 100, y / 100);
                    //d += value;

                    if(this.show_distance_field)
                    {
                        this.colorDistanceField(Math.abs(d), current_position);
                    }

                    if (Math.floor(Math.abs(d)) == 0) {
                        this.drawPoint(current_position[0], current_position[1], 0x20edf7)
                    }
                    //console.log(d);
                }
            }


        // let closest_cell_center = vec2.fromValues(100000, 100000);
        // for (let y = this.screen_height * 0.1 - 100; y < this.screen_height * 0.1 + 100; y++)
        //     for (let x = this.screen_width * 0.5 - 100; x < this.screen_width * 0.5 + 100; x++) {
        //         //find closest cell
        //         let current_position = vec2.fromValues(x, y);
        //         let point_center = vec2.fromValues(this.screen_width * 0.5, this.screen_height * 0.1);

        //         if (vec2.distance(current_position, point_center) < 100) {
        //             for (let cell_center of this.cells.keys()) {
        //                 let current_position = vec2.fromValues(x, y);
        //                 if (vec2.distance(cell_center, current_position) < vec2.distance(current_position, closest_cell_center)) {
        //                     closest_cell_center = cell_center;
        //                 }
        //             }
        //             //add points to closest cell
        //             this.cells.get(closest_cell_center)?.push(vec2.fromValues(x, y));
        //             closest_cell_center = vec2.fromValues(100000, 100000);
        //         }


        //     }
    }

    private calculateSeedPoints() {

        let point_center = vec2.fromValues(this.screen_width * 0.5, this.screen_height * 0.1);

        //50px around impact
        for (let i = 0; i < 20; i++) {
            let u = Math.random();
            let v = Math.random();
            let w = 50 * Math.sqrt(u);
            let t = 2 * Math.PI * v;
            let x = w * Math.cos(t)
            let y = w * Math.sin(t)
            if (vec2.distance(point_center, vec2.fromValues(this.impact_point[0] + x, this.impact_point[1] + y)) < this.radius) {
                this.cells.set(vec2.fromValues(this.impact_point[0] + x, this.impact_point[1] + y), []);
                this.drawPoint(this.impact_point[0] + x, this.impact_point[1] + y);
            }
        }

        // //100px around center
        // for (let i = 0; i < 10; i++) {
        //     let u = Math.random();
        //     let v = Math.random();
        //     let w = 100 * Math.sqrt(u);
        //     let t = 2 * Math.PI * v;
        //     let x = w * Math.cos(t)
        //     let y = w * Math.sin(t)
        //     this.cells.set(vec2.fromValues(point_center[0] + x, point_center[1] + y), []);
        //     this.drawPoint(point_center[0] + x, point_center[1] + y);
        // }
    }
}