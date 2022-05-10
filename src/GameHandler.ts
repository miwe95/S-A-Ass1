import { Container, Text, Ticker } from "pixi.js";
import { PlayerMovementHandler } from "./PlayerMovementHandler";
import { CatMullRom } from "./CatMullRom";
import { SceneSetup } from "./SceneSetup";
//@ts-ignore
import { app } from "./Index";
import { RigidBody } from "./rigidbody";
import { SceneHierarchy } from "./SceneHierarchy";

export class GameHandler extends Container {

    private player_movement: PlayerMovementHandler;
    private scene_setup: SceneSetup;
    private render_ticker: Ticker;
    private animation_ticker: Ticker;
    private fps_render_text: Text;
    private fps_animation_text: Text;

    private enemy_movement: CatMullRom;
    private rigid_body: RigidBody;
    private scene_hierarchy: SceneHierarchy;
 


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

        this.scene_hierarchy = new SceneHierarchy(screenWidth, screenHeight);
        this.addChild(this.scene_hierarchy);

        this.fps_render_text = new Text('');
        this.fps_animation_text = new Text('');

        this.render_ticker.autoStart = false;
        this.render_ticker.maxFPS = 60;
        this.animation_ticker.autoStart = false;
    }

    private showRenderFPS(ticker: Ticker, ) {
        //console.log(this.ticker.deltaMS);
        //console.log("delta_time" + this.ticker.deltaTime);
        //console.log("delta: " + _delta);
        this.removeChild(this.fps_render_text);
        this.fps_render_text = new Text("Render FPS: " + Math.round(ticker.FPS).toString(), { fontFamily: 'Arial', fontSize: 24, fill: 0xff1010, align: 'center'});
        this.addChild(this.fps_render_text)
    }

    private showAnimationFPS(ticker: Ticker, ) {
        //console.log(this.ticker.deltaMS);
        //console.log("delta_time" + this.ticker.deltaTime);
        //console.log("delta: " + _delta);
        this.removeChild(this.fps_animation_text);
        this.fps_animation_text = new Text("Animation FPS: " + Math.round(ticker.FPS).toString(),  { fontFamily: 'Arial', fontSize: 24, fill: 0xff1010, align: 'center'});
        this.fps_animation_text.transform.position.set(200, 0);
        this.addChild(this.fps_animation_text);
    }

    startLoops() {
        this.render_ticker.add(this.renderUpdate);
        this.animation_ticker.add(this.animationUpdate);
        this.render_ticker.start();
        this.animation_ticker.start();
    }

    private renderUpdate = (): void => {
        app.renderer.render(app.stage);
        this.showRenderFPS(this.render_ticker);
    }

    private animationUpdate = (): void => {
       this.showAnimationFPS(this.animation_ticker);
       this.enemy_movement.update(this.animation_ticker.deltaMS);
       this.rigid_body.update(this.animation_ticker.deltaMS);
       this.scene_hierarchy.update(this.animation_ticker.deltaMS);
    }


}