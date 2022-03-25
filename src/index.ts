import { Application} from 'pixi.js'
import { GameHandler } from './GameHandler';

export const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: innerWidth,
	height: innerHeight
});

const game_handler: GameHandler = new GameHandler(app.screen.width,app.screen.height);
app.stage.addChild(game_handler);

