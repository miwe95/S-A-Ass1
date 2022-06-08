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
    show_distance_field: boolean;
    apply_noise: boolean;
 


    constructor(_screenWidth: number, _screenHeight: number) {
        super();
        this.screen_width = _screenWidth;
        this.screen_height = _screenHeight;
        this.radius = 100;
        this.show_distance_field = false;
        this.apply_noise = false;
     

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

    private drawPoint(x: number, y: number, color: number, alpha: number = 1) {
        this.circle.beginFill(color , alpha);
        this.circle.drawCircle(x, y, 1);
        this.circle.endFill();
    }

    private findClosestPoints(current_position: vec2): Array<vec2> {
        let closest_cell_center = vec2.fromValues(this.impact_point[0], this.impact_point[1]);
        let second_closest_cell_center = vec2.fromValues(this.impact_point[0], this.impact_point[1]);
        for (let cell_center of this.cells.keys()) {
            if (vec2.distance(cell_center, current_position) < vec2.distance(current_position, closest_cell_center)) {
                second_closest_cell_center = closest_cell_center;
                closest_cell_center = cell_center;
                
            }
        }
        return [closest_cell_center, second_closest_cell_center];
    }

    private calculateCells() {
        let point_center = vec2.fromValues(Math.round(this.screen_width * 0.5), Math.round(this.screen_height * 0.1));
        let current_position: vec2 = vec2.fromValues(0, 0);
        perlin.noise.seed(Math.random());

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

                    //@ts-ignore

                    var nooise_value = perlin.noise.simplex2(x / 100, y / 100);
                    this.apply_noise ? d += Math.abs(nooise_value * 2) : d;
                    //console.log(value);


                    if (Math.floor(Math.abs(d)) == 0) {
                        this.drawPoint(current_position[0], current_position[1], 0x20edf7)
                    }
                    else {
                        if (this.show_distance_field) {
                            this.colorDistanceField(Math.abs(d), current_position);
                        }
                    }
                    //console.log(d);
                }
            }
    }

    private calculateSeedPoints() {

        let point_center = vec2.fromValues(this.screen_width * 0.5, this.screen_height * 0.1);

        //https://gis.stackexchange.com/questions/25877/generating-random-locations-nearby/25883#25883
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
                this.drawPoint(this.impact_point[0] + x, this.impact_point[1] + y, 0x999999);
            }
        }

        //100px around center
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
    //@ts-ignore
    private colorDistanceField(d: number, current_position: vec2) {
        //this.drawPoint(current_position[0], current_position[1], 0xf70505 + Math.abs(d) * 2000);
       
        if (d > 1 && d <= 20) {
            let a = '#ff0000' ; //8193285
            let b = '#ffae00'; //16207623
            let norm_d = (d - 1) / (20 - 1);
            let c = this.lerpColor(a.toString(), b.toString(), norm_d);
            console.log(c);
            //@ts-ignore
            this.drawPoint(current_position[0], current_position[1], c as number, 1)
        }
        else if (d > 20 && d <= 40) {
            let a = '#ffae00' ; //8193285
            let b = '#ffff00'; //16207623
            let norm_d = (d - 20) / (40 - 20);
            console.log(norm_d);
            let c = this.lerpColor(a.toString(), b.toString(), norm_d);
            //@ts-ignore
            this.drawPoint(current_position[0], current_position[1], c as number, 1)
        }
        else if (d > 40 && d <= 60) {
            let a = '#ffff00' ; //8193285
            let b = '#9dff00'; //16207623
            let norm_d = (d - 40) / (60 - 40);
            console.log(norm_d);
            let c = this.lerpColor(a.toString(), b.toString(), norm_d);
            //@ts-ignore
            this.drawPoint(current_position[0], current_position[1], c as number, 1)
        }
        else if (d > 60 && d <= 80) {
            let a = '#9dff00' ; //8193285
            let b = '#1aff00'; //16207623
            let norm_d = (d - 60) / (80 - 60);
            console.log(norm_d);
            let c = this.lerpColor(a.toString(), b.toString(), norm_d);
            //@ts-ignore
            this.drawPoint(current_position[0], current_position[1], c as number, 1)
        }
        else if (d > 80 && d <= 100) {
            let a = '#1aff00' ; //8193285
            let b = '#00ffae'; //16207623
            let norm_d = (d - 80) / (100 - 80);
            console.log(norm_d);
            let c = this.lerpColor(a.toString(), b.toString(), norm_d);
            //@ts-ignore
            this.drawPoint(current_position[0], current_position[1], c as number, 1)
        }
        else if (d > 100 && d <= 150) {
            let a = '#00ffae' ; //8193285
            let b = '#00bbff'; //16207623
            let norm_d = (d - 100) / (150 - 100);
            console.log(norm_d);
            let c = this.lerpColor(a.toString(), b.toString(), norm_d);
            //@ts-ignore
            this.drawPoint(current_position[0], current_position[1], c as number, 1)
        }
        else if (d > 150 && d <= 200) {
            let a = '#00bbff' ; //8193285
            let b = '#0040ff'; //16207623
            let norm_d = (d - 100) / (150 - 100);
            console.log(norm_d);
            let c = this.lerpColor(a.toString(), b.toString(), norm_d);
            //@ts-ignore
            this.drawPoint(current_position[0], current_position[1], c as number, 1)
        }
        else
        {
            this.drawPoint(current_position[0], current_position[1], 0x20e6f7, 1)
        }

        //let a = 0xf74f07;
        //let b = 0xf78f07;


        //let a = 0xf78f07;
        //let b = 0xf7df07;

    }

    private lerpColor(a:string, b:string, amount:number) { 

        var ah = +a.replace('#', '0x'),
            ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
            bh = +b.replace('#', '0x'),
            br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
            rr = ar + amount * (br - ar),
            rg = ag + amount * (bg - ag),
            rb = ab + amount * (bb - ab);
    
        return '0x' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
    }
}
