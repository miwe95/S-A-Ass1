import { Application} from 'pixi.js'
import { GameHandler } from './GameHandler';

export const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x20e6f7,
	width: innerWidth * 0.85,
	height: innerHeight,
	autoStart: false
});


const game_handler: GameHandler = new GameHandler(app.screen.width,app.screen.height);
game_handler.startLoops();
app.stage.addChild(game_handler);
