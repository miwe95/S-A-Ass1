import { Container, Text, Ticker } from "pixi.js";
import { PlayerMovementHandler } from "./PlayerMovementHandler";
import { CatMullRom } from "./CatMullRom";
import { SceneSetup } from "./SceneSetup";
//@ts-ignore
import { app } from "./Index";
import { RigidBody } from "./rigidbody";
import { HierarchyEnemy } from "./HierarchyEnemy";

export class GameHandler extends Container {

    private player_movement: PlayerMovementHandler;
    private enemy_movement: CatMullRom;
    private rigid_body: RigidBody;
    private hierarchy_enemy_1: HierarchyEnemy;
    private hierarchy_enemy_2: HierarchyEnemy;
    private hierarchy_enemy_3: HierarchyEnemy;
    private scene_setup: SceneSetup;
    private render_ticker: Ticker;
    private animation_ticker: Ticker;
    // @ts-ignore
    private fps_text: Text;


    constructor(screenWidth: number, screenHeight: number) {
        super();

        this.render_ticker = new Ticker();
        this.animation_ticker = new Ticker();

        this.scene_setup = new SceneSetup(screenWidth, screenHeight);
        this.addChild(this.scene_setup);

        this.player_movement = new PlayerMovementHandler(screenWidth, screenHeight);
        this.addChild(this.player_movement);

        this.enemy_movement = new CatMullRom(screenWidth, screenHeight);
        this.addChild(this.enemy_movement);

        this.rigid_body = new RigidBody(screenWidth, screenHeight);
        this.addChild(this.rigid_body);

        this.hierarchy_enemy_1 = new HierarchyEnemy(screenWidth, screenHeight, null, 0.1, 0);
        this.addChild(this.hierarchy_enemy_1);

        this.hierarchy_enemy_2 = new HierarchyEnemy(screenWidth, screenHeight, this.hierarchy_enemy_1, 0.1, -50);
        this.addChild(this.hierarchy_enemy_2);

        this.hierarchy_enemy_3 = new HierarchyEnemy(screenWidth, screenHeight, this.hierarchy_enemy_2, 0.1, -100);
        this.addChild(this.hierarchy_enemy_3);

        this.fps_text = new Text('');

        this.render_ticker.autoStart = false;
        this.render_ticker.maxFPS = 60;
        this.animation_ticker.autoStart = false;
    }

    private showFPS(ticker: Ticker) {
        //console.log(this.ticker.deltaMS);
        //console.log("delta_time" + this.ticker.deltaTime);
        //console.log("delta: " + _delta);
        this.removeChild(this.fps_text);
        this.fps_text = new Text("FPS: " + Math.round(ticker.FPS).toString(), { fontFamily: 'Arial', fontSize: 24, fill: 0xff1010, align: 'center' });
        this.addChild(this.fps_text);
    }

    startLoops() {
        this.render_ticker.add(this.renderUpdate);
        this.animation_ticker.add(this.animationUpdate);
        this.render_ticker.start();
        this.animation_ticker.start();
    }

    private renderUpdate = (): void => {
        app.renderer.render(app.stage);
        this.showFPS(this.render_ticker);
        //this.enemy_movement.update(_delta);
    }
    //@ts-ignore
    private animationUpdate = (): void => {
        //this.showFrames(this.animation_ticker);
       this.enemy_movement.update(this.animation_ticker.deltaMS);
       this.rigid_body.update(this.animation_ticker.deltaMS);
       this.hierarchy_enemy_1.update(this.animation_ticker.deltaMS);
       this.hierarchy_enemy_2.update(this.animation_ticker.deltaMS);
       this.hierarchy_enemy_3.update(this.animation_ticker.deltaMS);
    }


}