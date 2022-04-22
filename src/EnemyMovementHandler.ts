import { Container, Sprite, Ticker } from "pixi.js";
import * as PIXI from 'pixi.js';

export class EnemyMovementHandler extends Container{
    private enemy: Sprite;
    private ticker: Ticker;
    private reverse: Boolean;

    constructor(_screenWidth: number, _screenHeight: number){
        super();
        this.enemy = Sprite.from("enemy.png");
        this.enemy.anchor.set(0.5);
        this.enemy.scale.x = 0.2;
        this.enemy.scale.y = 0.2;
        this.enemy.x = 500;
        this.enemy.y = _screenHeight - 500;
        this.enemy.interactive = true;
        this.addChild(this.enemy);
        this.ticker = new Ticker();
        this.ticker.autoStart = false;
        this.ticker.add(this.update);
        this.ticker.start();
        this.reverse = new Boolean(false);

        let obj = new PIXI.Graphics();
        obj.lineStyle(4, 0x5a5e5b, 1);
        obj.moveTo(500, _screenHeight - 500);
        obj.lineTo(1000, _screenHeight - 500);
        this.addChild(obj);
        }

    private update = (): void => {

        if (this.enemy.x < 1000 && this.reverse == false) {
            this.enemy.x += 1;
        }
    
        if (this.enemy.x >= 999) {
            this.reverse = true   
        }
        
        if (this.reverse == true) {
            this.enemy.x -= 1;
         }

        if (this.enemy.x <= 499) {
            this.reverse = false
         }
        
    };

}