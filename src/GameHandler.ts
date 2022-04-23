import { Container } from "pixi.js";
import { PlayerMovementHandler } from "./PlayerMovementHandler";
import { CatMullRom} from "./CatMullRom";
import { SceneSetup } from "./SceneSetup";
//import {app} from "./Index";

export class GameHandler extends Container{
   
    private player_movement: PlayerMovementHandler; 
    private enemy_movement: CatMullRom;
    private scene_setup: SceneSetup;

    constructor(screenWidth: number, screenHeight: number) {
        super();

        this.scene_setup = new SceneSetup(screenWidth, screenHeight);
        this.addChild(this.scene_setup);

        this.player_movement = new PlayerMovementHandler(screenWidth, screenHeight);
        this.addChild(this.player_movement);

        this.enemy_movement = new CatMullRom(screenWidth, screenHeight);
        this.addChild(this.enemy_movement);
    }
    
}