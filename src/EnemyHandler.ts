
import { Sprite } from "pixi.js";
import { Voronoi } from "./Voronoi";

export class EnemyHandler {
    spriteCollection: Sprite[];

    private static Instance: EnemyHandler;
    voronoi!: Voronoi;


    public static getInstance(): EnemyHandler {
        if (!EnemyHandler.Instance) {
            EnemyHandler.Instance = new EnemyHandler();
        }
        return EnemyHandler.Instance;
    }

    constructor() {
        this.spriteCollection = [];
    }

    addSpriteToCollection(sprite: Sprite) {
        this.spriteCollection.push(sprite);
    }
}