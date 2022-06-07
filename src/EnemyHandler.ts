import * as PIXI from "pixi.js";
import { Sprite } from "pixi.js";


export class EnemyHandler{
    spriteCollection : PIXI.Sprite[];

    private static Instance : EnemyHandler;

    public static getInstance() : EnemyHandler{
        if(!EnemyHandler.Instance){
            EnemyHandler.Instance = new EnemyHandler(); 
        }
        return EnemyHandler.Instance;
    }

    constructor(){
        this.spriteCollection = []; 
    }

    addSpriteToCollection(sprite : Sprite){
        this.spriteCollection.push(sprite);
    }
}