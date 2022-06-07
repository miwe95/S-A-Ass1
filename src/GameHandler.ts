import { Container, Text, Ticker } from "pixi.js";
import { ParticleDynamicsDrawer } from "./ParticleDynamicsDrawer";
import { CatMullRom } from "./CatMullRom";
import { SceneSetup } from "./SceneSetup";
import * as PIXI from "pixi.js";
//@ts-ignore
import { app } from "./Index";
import { SceneHierarchy } from "./SceneHierarchy";
import { vec2 } from "gl-matrix";
import { KeyboardHandler } from "./KeyboardHandler";
import { ParticleDynamics } from "./ParticleDynamics";
import { Voronoi } from "./Voronoi";


export class GameHandler extends Container {

    private scene_setup: SceneSetup;
    private enemy_movement_1: CatMullRom;
    private enemy_movement_2: CatMullRom;
    private scene_hierarchy: SceneHierarchy;
    private particle_dynamics_drawer: ParticleDynamicsDrawer;
    private particle_dynamics: ParticleDynamics;
    private keyboard_handler: KeyboardHandler;
    private voronoi: Voronoi;
    private screen_width: number;
    private screen_height: number;
    private game_over: boolean;

    render_ticker: Ticker;
    animation_ticker: Ticker;

    private fps_render_text: Text;
    private fps_animation_text: Text;
    //@ts-ignore
    private paused: boolean;


    constructor(screenWidth: number, screenHeight: number) {
        super();
        this.paused = false;
        this.render_ticker = new Ticker();
        this.animation_ticker = new Ticker();

        this.scene_setup = new SceneSetup(screenWidth, screenHeight);
        this.addChild(this.scene_setup);

        this.enemy_movement_1 = new CatMullRom(screenWidth, screenHeight, [vec2.fromValues(0.1, 0.1), vec2.fromValues(0.2, 0.1), vec2.fromValues(0.2, 0.2), vec2.fromValues(0.1, 0.2)], "enemy.png");
        this.addChild(this.enemy_movement_1);

        this.enemy_movement_2 = new CatMullRom(screenWidth, screenHeight, [vec2.fromValues(0.7, 0.7), vec2.fromValues(0.8, 0.7), vec2.fromValues(0.8, 0.8), vec2.fromValues(0.7, 0.8)], "tetanus.png");
        this.addChild(this.enemy_movement_2);

        this.scene_hierarchy = new SceneHierarchy(screenWidth, screenHeight);
        this.addChild(this.scene_hierarchy);

        this.particle_dynamics_drawer = new ParticleDynamicsDrawer(screenWidth, screenHeight);
        this.addChild(this.particle_dynamics_drawer);

        this.particle_dynamics = new ParticleDynamics(screenWidth, screenHeight);
        this.addChild(this.particle_dynamics);

        this.voronoi = new Voronoi(screenWidth, screenHeight);
        this.addChild(this.voronoi);

        this.keyboard_handler = new KeyboardHandler(this, this.particle_dynamics_drawer, this.enemy_movement_1, this.enemy_movement_2, this.scene_hierarchy, this.particle_dynamics, this.voronoi);
        this.addChild(this.keyboard_handler);

        this.fps_render_text = new Text('');
        this.fps_animation_text = new Text('');

        this.render_ticker.autoStart = false;
        this.render_ticker.maxFPS = 60;
        this.animation_ticker.maxFPS = 60;

        this.animation_ticker.autoStart = false;

        this.screen_width = screenWidth;
        this.screen_height = screenHeight;
        this.game_over = false;

        
    }

    private showRenderFPS(ticker: Ticker,) {
        //console.log(this.ticker.deltaMS);
        //console.log("delta_time" + this.ticker.deltaTime);
        //console.log("delta: " + _delta);
        this.removeChild(this.fps_render_text);
        //this.fps_render_text = new Text("Render FPS: " + Math.round(ticker.FPS).toString(), { fontFamily: 'Arial', fontSize: 24, fill: 0xff1010, align: 'center' });
        document.getElementById('renderfps')!.textContent = "Render: " + Math.round(ticker.FPS).toString();
        this.addChild(this.fps_render_text)
    }

    private showAnimationFPS(ticker: Ticker,) {
        //console.log(this.ticker.deltaMS);
        //console.log("delta_time" + this.ticker.deltaTime);
        //console.log("delta: " + _delta);
        this.removeChild(this.fps_animation_text);
        //this.fps_animation_text = new Text("Animation FPS: " + Math.round(ticker.FPS).toString(), { fontFamily: 'Arial', fontSize: 24, fill: 0xff1010, align: 'center' });
        document.getElementById('animationfps')!.textContent = "Animation: " + Math.round(ticker.FPS).toString();  
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
        //this.showPoints(this.animation_ticker);
        this.enemy_movement_1.update(this.animation_ticker.deltaMS);
        this.enemy_movement_2.update(this.animation_ticker.deltaMS);
        //this.rigid_body.update(this.animation_ticker.deltaMS);
        this.scene_hierarchy.update(this.animation_ticker.deltaMS);
        this.particle_dynamics.update(this.animation_ticker.deltaMS);
        this.voronoi.update(this.animation_ticker.deltaMS);

        if ( this.game_over)
        {
        this.animation_ticker.stop();
        this.render_ticker.stop();
        }

        if (document.getElementById('lifeoutput')!.textContent == "0")
        {

            var style = {
                font : 'bold italic 360px Arial',
                fill : '#ff0000',
                stroke : '#000000',
                strokeThickness : 8,
                dropShadow : true,
                dropShadowColor : '#000000',
                dropShadowAngle : Math.PI / 6,
                dropShadowDistance : 6,
                wordWrap : true,
                wordWrapWidth : 440
            };
            
        var richText = new PIXI.Text('Game Over! You are Dead!',style);
        richText.anchor.set(0.5);
        richText.x = this.screen_width / 2;
        richText.y = this.screen_height / 2;
        this.addChild(richText);
        this.game_over = true
    }

    if (document.getElementById('pointoutput')!.textContent == "5")
    {

        var style = {
            font : 'bold italic 360px Arial',
            fill : '#ff0000',
            stroke : '#000000',
            strokeThickness : 8,
            dropShadow : true,
            dropShadowColor : '#000000',
            dropShadowAngle : Math.PI / 6,
            dropShadowDistance : 6,
            wordWrap : true,
            wordWrapWidth : 440
        };
        
    var richText = new PIXI.Text('You did it! Congratualtions!',style);
    richText.anchor.set(0.5);
    richText.x = this.screen_width / 2;
    richText.y = this.screen_height / 2;
    this.addChild(richText);
    this.game_over = true
}

    }


}