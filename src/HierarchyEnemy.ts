import { Container, Sprite } from "pixi.js";
import { Transform } from "./Transform";

export class HierarchyEnemy extends Container {

    transform_: Transform;
    enemy: Sprite;
    is_root: boolean;

    constructor(screen_width: number, screen_heigth: number, parent: HierarchyEnemy | null, scale: number) {
        super();
        this.transform_ = new Transform(screen_width, screen_heigth, parent?.transform_ ?? null);
        this.enemy = Sprite.from("tetanus-37.png");
        this.enemy.interactive = true;
        this.enemy.scale.set(scale, scale);
        this.enemy.position.x = screen_width / 2;
        this.enemy.position.y = screen_heigth / 2;
        this.is_root = true ? parent == null : false;
        this.addChild(this.enemy);
    }

    //@ts-ignore
    update(dt:number){
        if(this.is_root){
        }
    }
}