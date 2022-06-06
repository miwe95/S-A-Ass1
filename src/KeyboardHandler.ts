import { Container, Ticker } from "pixi.js";
import { CatMullRom } from "./CatMullRom";
import { GameHandler } from "./GameHandler";
import { ParticleDynamicsDrawer } from "./ParticleDynamicsDrawer";
import {ParticleDynamics} from "./ParticleDynamics"
import { SceneHierarchy } from "./SceneHierarchy";
const Keyboard = require('pixi.js-keyboard');

export class KeyboardHandler extends Container {

    private keyboard_ticker: Ticker;
    private forefield_toggle: HTMLElement;
    private forcefield_toggle_input: boolean;
    private pause_game_toggle: HTMLElement;
    private pause_game_toggle_input: boolean;
    private particle_dynamics_method: HTMLElement;
    private particle_dynamics_trajectory: HTMLElement;
    private particle_dynamics_method_toggle: boolean;
    private particle_dynamics_trajectory_toggle: boolean;
    private particle_dynamics_drawer: ParticleDynamicsDrawer;
    private particle_dynamics: ParticleDynamics;
    private game_handler: GameHandler;
    private enemy_movement_1: CatMullRom;
    private enemy_movement_2: CatMullRom;
    private scene_hierarchy: SceneHierarchy;

    constructor(game_handler: GameHandler, particle_dynamics_drawer: ParticleDynamicsDrawer, enemy_movement_1: CatMullRom, enemy_movement_2: CatMullRom, scene_hierarchy: SceneHierarchy, particle_dynamics: ParticleDynamics) {
        super();

        this.particle_dynamics = particle_dynamics;
        this.particle_dynamics_drawer = particle_dynamics_drawer;
        this.game_handler = game_handler;
        this.enemy_movement_1 = enemy_movement_1;
        this.enemy_movement_2 = enemy_movement_2;
        this.scene_hierarchy = scene_hierarchy;

        this.keyboard_ticker = new Ticker();
        this.keyboard_ticker.autoStart = false;
        this.keyboard_ticker.add(this.checkKeyInput);
        this.keyboard_ticker.start();

        this.forcefield_toggle_input = false;
        this.pause_game_toggle_input = false;
        this.particle_dynamics_method_toggle = false;
        this.particle_dynamics_trajectory_toggle = false;
   
        this.forefield_toggle = document.getElementById('forcefield')!;
        this.forefield_toggle!.addEventListener('change', this.handleForceFieldToggleChange);

        this.pause_game_toggle = document.getElementById('pausegame')!;
        this.pause_game_toggle!.addEventListener('change', this.handlePauseGameToggleChange);

        this.particle_dynamics_method = document.getElementById("method")!;
        this.particle_dynamics_method.addEventListener('change', this.handleParticleDynamicsMethodChange);

        this.particle_dynamics_trajectory = document.getElementById("trajectory")!;
        this.particle_dynamics_trajectory.addEventListener('change', this.handleParticleDynamicsTrajectoryChange);
        this.particle_dynamics_trajectory.addEventListener('change', this.handleParticleDynamicsTrajectoryChange);
    }

    private handleParticleDynamicsTrajectoryChange = (): void => {
        if(!this.particle_dynamics_trajectory_toggle)
        {
            this.particle_dynamics.trajectory = true;
        }
        else
        {
            this.particle_dynamics.trajectory = false;
            this.particle_dynamics.removeTrajectory();
        }
        this.particle_dynamics_trajectory_toggle = !this.particle_dynamics_trajectory_toggle;
    }

    private handleParticleDynamicsMethodChange = (): void => {
        if(!this.particle_dynamics_method_toggle)
        {
            this.particle_dynamics.euler = true;
        }
        else
        {
            this.particle_dynamics.euler = false;
        }
        this.particle_dynamics_method_toggle = !this.particle_dynamics_method_toggle;
    }
    
    private handleForceFieldToggleChange = (): void => {
        //@ts-ignore
        console.log(this.particle_dynamics_drawer);
        if (!this.forcefield_toggle_input)
        this.particle_dynamics_drawer.drawForceField();
        else
        this.particle_dynamics_drawer.removeForceField();
        
        this.forcefield_toggle_input = !this.forcefield_toggle_input;
    
    }
    
    private handlePauseGameToggleChange = (): void => {
        if (!this.pause_game_toggle_input)
        {
            this.game_handler.animation_ticker.stop();
            this.game_handler.render_ticker.stop();
        }
        else
        {
            this.game_handler.animation_ticker.start();
            this.game_handler.render_ticker.start();
        }
        this.pause_game_toggle_input = !this.pause_game_toggle_input;
    }

    private keyInput() {
        //@ts-ignore
        var val = document.getElementById("animationsetting")!.value;
        this.game_handler.animation_ticker.maxFPS = val;

        //@ts-ignore
        val = document.getElementById("rendersetting")!.value;
        this.game_handler.render_ticker.maxFPS = val;

        //@ts-ignore
        val = document.getElementById("hierarchicalslider")!.value;
        this.scene_hierarchy.increaseRadius(this.game_handler.animation_ticker.deltaMS, val);

        if (Keyboard.isKeyPressed('KeyQ')) {
            if (this.enemy_movement_1.show_graphics) {
                this.enemy_movement_1.removeGraphics();
                this.enemy_movement_2.removeGraphics();
            } else {
                this.enemy_movement_1.showGraphics();
                this.enemy_movement_2.showGraphics();
            }
        }

        if (Keyboard.isKeyPressed('KeyW')) {
            this.enemy_movement_1.changeSpeed();
            this.enemy_movement_2.changeSpeed();
        }
       
        if (Keyboard.isKeyDown('ArrowDown', 'KeyS')) {
            this.scene_hierarchy.decreaseRadius(this.game_handler.animation_ticker.deltaMS);
        }
    }

    private checkKeyInput = (): void => {
        this.keyInput();
        Keyboard.update();
    }
}