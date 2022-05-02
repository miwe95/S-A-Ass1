import { Container, Graphics, InteractionEvent, Sprite, Ticker } from "pixi.js";
import { cGraphics } from "./Utils";

export class CatMullRom extends Container {
    private enemy: Sprite;
    private control_points: cGraphics[];
    private catmull_points: cGraphics[];
    private ticker: Ticker;
    private segment_counter: number;
    //@ts-ignore
    private t_finder: number;
    private selected_point: Graphics;
    //private arc_lengths: number[];
    private lookup_table: Map<number, Map<number, number>>;

    constructor(_screenWidth: number, _screenHeight: number) {
        super();
        this.segment_counter = 0;
        this.t_finder = 0; 
        this.selected_point = new Graphics();

        this.catmull_points = [];
        this.control_points = [];
        this.lookup_table = new Map<number, Map<number, number>>();

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

    private reDrawControlPoints() {
        for (var graphic of this.control_points) {
            graphic.removeListener("mousemove");
            this.removeChild(graphic);
            this.drawPoint(graphic, 0xeb4034, 9);
        }
    }

    private normalizeLengths(index: number, chordLength: number){
        let tmp_t1 : number[];
        let tmp_dist1 : number[];
        tmp_t1 = [];
        tmp_dist1 = [];
        
        this.lookup_table.get(index)?.forEach((val, key) =>{
            tmp_t1.push(val);
            tmp_dist1.push(key/=chordLength);
        });

        this.lookup_table.get(index)?.clear();
        for(let i = 0; i < tmp_t1.length;i++){
            this.lookup_table.get(index)?.set(tmp_dist1[i], tmp_t1[i])
        }   
    }

    private calculateCatMull() {
        let x_coord = 0;
        let y_coord = 0;
        let old = 0;
        let chordLength = 0;
        let counter = 0;
        this.lookup_table.clear();

        this.lookup_table.set(0, new Map<number, number>());
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
            this.lookup_table.get(0)?.set(chordLength, i);


        }

        this.normalizeLengths(0, chordLength);
    
        old = 0;
        chordLength = 0;
        this.lookup_table.set(1, new Map<number, number>());
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
            this.lookup_table.get(1)?.set(chordLength, i);
           
        }

        this.normalizeLengths(1, chordLength);

        old = 0;
        chordLength = 0;
        this.lookup_table.set(2, new Map<number, number>());
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
            this.lookup_table.get(2)?.set(chordLength, i);
         
        }

        this.normalizeLengths(2, chordLength);

        old = 0;
        chordLength = 0;
        this.lookup_table.set(3, new Map<number, number>());
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
            this.lookup_table.get(3)?.set(chordLength, i);
        }

        this.normalizeLengths(3, chordLength);
        console.log(this.lookup_table);
        for (var graphic of this.catmull_points) {
            this.drawPoint(graphic, 0xe3e1e1, 3);
            graphic.on("mouseup", this.releasePoint);
        }
    }

    private update = (): void => {
        // if (this.move_counter >= this.catmull_points.length) {
        //     this.move_counter = 0;
        // }
        // this.enemy.x = this.catmull_points[this.move_counter].x;
        // this.enemy.y = this.catmull_points[this.move_counter].y;
        // this.move_counter += 1;
        //@ts-ignore
        this.t_finder += 0.01;
        let keys: number[];
        keys = [];
        //@ts-ignore
        this.lookup_table.get(this.segment_counter)?.forEach((val, key) => {
            keys.push(key);
        })

        //@ts-ignore
        const output = keys.reduce((prev, curr) => Math.abs(curr - this.t_finder) < Math.abs(prev - this.t_finder) ? curr : prev); 
        //console.log(output);
        let t = this.lookup_table.get(this.segment_counter)?.get(output) as number;

        if(this.segment_counter == 0){
            this.enemy.x = this.catMullRom(t, this.control_points[0].x, this.control_points[1].x, this.control_points[2].x, this.control_points[3].x);
            this.enemy.y = this.catMullRom(t, this.control_points[0].y, this.control_points[1].y, this.control_points[2].y, this.control_points[3].y);
        }else if(this.segment_counter == 1)
        {
            this.enemy.x = this.catMullRom(t, this.control_points[1].x, this.control_points[2].x, this.control_points[3].x, this.control_points[0].x);
            this.enemy.y = this.catMullRom(t, this.control_points[1].y, this.control_points[2].y, this.control_points[3].y, this.control_points[0].y);
        }else if(this.segment_counter == 2)
        {
            this.enemy.x = this.catMullRom(t, this.control_points[2].x, this.control_points[3].x, this.control_points[0].x, this.control_points[1].x);
            this.enemy.y = this.catMullRom(t, this.control_points[2].y, this.control_points[3].y, this.control_points[0].y, this.control_points[1].y);
        }
        else if (this.segment_counter == 3){
            this.enemy.x = this.catMullRom(t, this.control_points[3].x, this.control_points[0].x, this.control_points[1].x, this.control_points[2].x);
            this.enemy.y = this.catMullRom(t, this.control_points[3].y, this.control_points[0].y, this.control_points[1].y, this.control_points[2].y);
        }

        if(output === 1){
            this.segment_counter++;
            this.t_finder = 0;
        }

        if(this.segment_counter === 4 && output === 1)
        {
            this.segment_counter = 0;
            this.t_finder = 0;
        }
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