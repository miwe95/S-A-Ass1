import { Container, Sprite } from "pixi.js";

export class EnemyMovementHandler extends Container{
    private enemy: Sprite;
    //private ticker: Ticker;

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
    }
}