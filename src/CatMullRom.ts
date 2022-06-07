import { vec2 } from "gl-matrix";
import { Container, Graphics, InteractionEvent, Sprite } from "pixi.js";
import { cGraphics } from "./Utils";
import { EnemyHandler } from './EnemyHandler';


class TableEntrys {
    segment: number;
    t: number;

    constructor(segment: number, t: number) {
        this.segment = segment;
        this.t = t;
    }
}

export class CatMullRom extends Container {
    private enemy: Sprite;
    private control_points: cGraphics[];
    private catmull_points: cGraphics[];
    //@ts-ignore
    private distance: number;
    private selected_point: Graphics;
    //private arc_lengths: number[];
    private lookup_table: Map<number, TableEntrys>;
    speed: number;
    show_graphics: boolean;
    increase_speed: boolean;


    constructor(_screenWidth: number, _screenHeight: number, control_points_position: vec2[], png: string) {
        super();

        this.distance = 0;
        this.selected_point = new Graphics();
        this.speed = 0.1;
        this.show_graphics = false;
        this.increase_speed = false;

        this.catmull_points = [];
        this.control_points = [];
        this.lookup_table = new Map<number, TableEntrys>();

        this.control_points.push(new cGraphics(control_points_position[0][0] * _screenWidth, control_points_position[0][1] * _screenHeight, true));
        this.control_points.push(new cGraphics(control_points_position[1][0] * _screenWidth, control_points_position[1][1] * _screenHeight, true));
        this.control_points.push(new cGraphics(control_points_position[2][0] * _screenWidth, control_points_position[2][1] * _screenHeight, true));
        this.control_points.push(new cGraphics(control_points_position[3][0] * _screenWidth, control_points_position[3][1] * _screenHeight, true));

        this.calculateSamplePoints();
        //this.drawControlPoints();

        this.enemy = Sprite.from(png);
        this.enemy.anchor.set(0.6);
        this.enemy.scale.x = 0.15;
        this.enemy.scale.y = 0.15;
        this.enemy.x = this.control_points[0].x;
        this.enemy.y = this.control_points[0].y;
        this.enemy.interactive = true;
        EnemyHandler.getInstance().addSpriteToCollection(this.enemy);
        this.addChild(this.enemy);
    }


    changeSpeed(){
        if (this.increase_speed){
            this.speed = 0.1;
            this.increase_speed = !this.increase_speed;
        }
        else
        {
            this.speed = 1;
            this.increase_speed = !this.increase_speed;
        }
    }

    showGraphics() {
        this.show_graphics = true;
        for (var graphic of this.catmull_points) {
            this.drawPoint(graphic, 0xe3e1e1, 3);
            graphic.on("mouseup", this.releasePoint);
        }
        for (var graphic of this.control_points) {
            graphic.on("mousedown", this.selectPoint);
            graphic.on("mouseup", this.releasePoint);
            this.drawPoint(graphic, 0xeb4034, 9);
        }

    }

    removeGraphics() {
        this.show_graphics = false;
        for (var graphic of this.catmull_points) {
            this.removeChild(graphic);
        }
        for (var graphic of this.control_points) {
            this.removeChild(graphic);
        }

    }

    private reDrawControlPoints() {
        for (var graphic of this.control_points) {
            graphic.removeListener("mousemove");
            this.removeChild(graphic);
            this.drawPoint(graphic, 0xeb4034, 9);
        }
    }

    private normalizeLengths(total_length: number) {
        let tmp_segment_t: TableEntrys[];
        let tmp_chord: number[];
        tmp_segment_t = [];
        tmp_chord = [];

        this.lookup_table.forEach((val, key) => {
            tmp_segment_t.push(val);
            tmp_chord.push(key /= total_length);
        });

        this.lookup_table.clear();
        for (let i = 0; i < tmp_chord.length; i++) {
            this.lookup_table.set(tmp_chord[i], tmp_segment_t[i])
        }
    }

    private calculateSamplePoints() {
        let x_coord = 0;
        let y_coord = 0;
        let old = 0;
        let chordLength = 0;
        let counter = 0;
        this.lookup_table.clear();

        //this.lookup_table.set(0, new Map<number, number>());
        for (let i = 0; i <= 1; i += 0.01) {
            x_coord = this.catMullRom(i, this.control_points[0].x, this.control_points[1].x, this.control_points[2].x, this.control_points[3].x);
            y_coord = this.catMullRom(i, this.control_points[0].y, this.control_points[1].y, this.control_points[2].y, this.control_points[3].y);
            this.catmull_points.push(new cGraphics(x_coord, y_coord, true));

            //                      segments     length  t-value
            //lookup_table = new map<number, map<number, number>>()
            let distance = Math.sqrt((this.catmull_points[counter].x - this.catmull_points[counter - old].x) *
                (this.catmull_points[counter].x - this.catmull_points[counter - old].x) + (this.catmull_points[counter].y - this.catmull_points[counter - old].y) *
                (this.catmull_points[counter].y - this.catmull_points[counter - old].y));
            old = 1;
            counter++;
            chordLength += distance;
            this.lookup_table.set(chordLength, new TableEntrys(0, i));
        }


        old = 0;
        //chordLength = 0;
        for (let i = 0; i <= 1; i += 0.01) {
            x_coord = this.catMullRom(i, this.control_points[1].x, this.control_points[2].x, this.control_points[3].x, this.control_points[0].x);
            y_coord = this.catMullRom(i, this.control_points[1].y, this.control_points[2].y, this.control_points[3].y, this.control_points[0].y);
            this.catmull_points.push(new cGraphics(x_coord, y_coord, true));
            let distance = Math.sqrt((this.catmull_points[counter].x - this.catmull_points[counter - old].x) *
                (this.catmull_points[counter].x - this.catmull_points[counter - old].x) + (this.catmull_points[counter].y - this.catmull_points[counter - old].y) *
                (this.catmull_points[counter].y - this.catmull_points[counter - old].y));
            old = 1;
            counter++;
            chordLength += distance;
            this.lookup_table.set(chordLength, new TableEntrys(1, i));

        }


        old = 0;
        //chordLength = 0;
        for (let i = 0; i <= 1; i += 0.01) {
            x_coord = this.catMullRom(i, this.control_points[2].x, this.control_points[3].x, this.control_points[0].x, this.control_points[1].x);
            y_coord = this.catMullRom(i, this.control_points[2].y, this.control_points[3].y, this.control_points[0].y, this.control_points[1].y);
            this.catmull_points.push(new cGraphics(x_coord, y_coord, true));
            let distance = Math.sqrt((this.catmull_points[counter].x - this.catmull_points[counter - old].x) *
                (this.catmull_points[counter].x - this.catmull_points[counter - old].x) + (this.catmull_points[counter].y - this.catmull_points[counter - old].y) *
                (this.catmull_points[counter].y - this.catmull_points[counter - old].y));
            old = 1;
            counter++;
            chordLength += distance;
            this.lookup_table.set(chordLength, new TableEntrys(2, i));

        }



        old = 0;
        //chordLength = 0;
        for (let i = 0; i <= 1; i += 0.01) {
            x_coord = this.catMullRom(i, this.control_points[3].x, this.control_points[0].x, this.control_points[1].x, this.control_points[2].x);
            y_coord = this.catMullRom(i, this.control_points[3].y, this.control_points[0].y, this.control_points[1].y, this.control_points[2].y);
            this.catmull_points.push(new cGraphics(x_coord, y_coord, true));
            let distance = Math.sqrt((this.catmull_points[counter].x - this.catmull_points[counter - old].x) *
                (this.catmull_points[counter].x - this.catmull_points[counter - old].x) + (this.catmull_points[counter].y - this.catmull_points[counter - old].y) *
                (this.catmull_points[counter].y - this.catmull_points[counter - old].y));
            old = 1;
            counter++;
            chordLength += distance;
            this.lookup_table.set(chordLength, new TableEntrys(3, i));
        }

        this.normalizeLengths(chordLength);
        //  console.log(this.lookup_table);
        if (this.show_graphics) {
            for (var graphic of this.catmull_points) {
                this.drawPoint(graphic, 0xe3e1e1, 3);
                graphic.on("mouseup", this.releasePoint);
            }
        }
    }

    update = (_delta: number): void => {
        let keys: number[];
        keys = [];
        // console.log(_delta);

        this.lookup_table.forEach((_val, key) => {
            keys.push(key);
        })

        let output = keys.reduce((prev, curr) => Math.abs(curr - this.distance) < Math.abs(prev - this.distance) ? curr : prev);
        let table_entry = this.lookup_table.get(output) as TableEntrys;

        if (table_entry.segment == 0) {

            this.distance += this.ease(this.distance, 0.05, 0.15) * this.speed * _delta / 1000;
            output = keys.reduce((prev, curr) => Math.abs(curr - this.distance) < Math.abs(prev - this.distance) ? curr : prev);
            table_entry = this.lookup_table.get(output) as TableEntrys;
        }
        else {
            this.distance += this.speed * _delta / 1000;
        }
        //console.log(this.delta_t);

        if (table_entry.segment == 0) {
            this.enemy.x = this.catMullRom(table_entry.t, this.control_points[0].x, this.control_points[1].x, this.control_points[2].x, this.control_points[3].x);
            this.enemy.y = this.catMullRom(table_entry.t, this.control_points[0].y, this.control_points[1].y, this.control_points[2].y, this.control_points[3].y);
        } else if (table_entry.segment == 1) {
            this.enemy.x = this.catMullRom(table_entry.t, this.control_points[1].x, this.control_points[2].x, this.control_points[3].x, this.control_points[0].x);
            this.enemy.y = this.catMullRom(table_entry.t, this.control_points[1].y, this.control_points[2].y, this.control_points[3].y, this.control_points[0].y);
        } else if (table_entry.segment == 2) {
            this.enemy.x = this.catMullRom(table_entry.t, this.control_points[2].x, this.control_points[3].x, this.control_points[0].x, this.control_points[1].x);
            this.enemy.y = this.catMullRom(table_entry.t, this.control_points[2].y, this.control_points[3].y, this.control_points[0].y, this.control_points[1].y);
        }
        else if (table_entry.segment == 3) {
            this.enemy.x = this.catMullRom(table_entry.t, this.control_points[3].x, this.control_points[0].x, this.control_points[1].x, this.control_points[2].x);
            this.enemy.y = this.catMullRom(table_entry.t, this.control_points[3].y, this.control_points[0].y, this.control_points[1].y, this.control_points[2].y);
        }

        if (output == 1) {
            this.distance = 0;
        }

    };

    private ease(t: number, k1: number, k2: number) {
        let f; let s;
        f = k1 * 2 / Math.PI + k2 * k1 + (1.0 * k2) * 2 / Math.PI;
        //console.log("f = " + f);
        if (t < k1) {
            s = k1 * (2 / Math.PI) * (Math.sin((t / k1) * Math.PI / 2 * Math.PI / 2) + 1);
            //console.log("slow:");
        }
        else if (t < k2) {

            s = (2 * k1 / Math.PI + t * k1);
            //console.log("fast:" );S
        }
        else {
            s = 2 * k1 / Math.PI + k2 * k1 + ((1 - k2) * (2 / Math.PI)) *
                Math.sin(((t * k2) / (1.0 * k2)) * Math.PI / 2);
            //console.log("end ");
        }
        //console.log("s= " + s);
        //console.log("s / f= " + s/f);
        return (s / f);
    }

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
            this.calculateSamplePoints();

        }
    }

    private releasePoint = (_e: InteractionEvent): void => {
        this.selected_point.removeListener("mousemove");
        this.reDrawControlPoints();
    }
}