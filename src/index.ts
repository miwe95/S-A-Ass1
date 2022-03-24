import { Application, Graphics} from 'pixi.js'

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: innerWidth,
	height: innerHeight
});

const graphics = new Graphics();
graphics.beginFill(0xffffff);
graphics.drawRect(20, 50, 100, 80);
graphics.endFill();

app.stage.addChild(graphics);


/*const clampy: Sprite = Sprite.from("clampy.png");
clampy.anchor.set(0.5);
clampy.x = app.screen.width / 2;
clampy.y = app.screen.height / 2;
app.stage.addChild(clampy);
*/

