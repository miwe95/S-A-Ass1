import { Container, Graphics, Sprite } from "pixi.js";
//import { mat3, vec2, vec3 } from "gl-matrix";
import { mat3 } from "gl-matrix";

export class HierarchyEnemy extends Container {

    sprite_: Sprite;
    transformation_matrix_: mat3;
    local_transformation_matrix: mat3;
    child_: HierarchyEnemy | null;
    point_: Graphics;
    screen_width_: number;
    screen_height_: number;

    constructor(screen_width: number, screen_heigth: number, scale: number, png: string, child: HierarchyEnemy | null) {
        super();

        this.transformation_matrix_ = mat3.create();
        this.local_transformation_matrix = mat3.create();
        this.child_ = child;
        this.screen_width_ = screen_width;
        this.screen_height_ = screen_heigth;
        this.point_ = new Graphics();
        this.point_.lineStyle(4, 0x5a5e5b, 1);
        this.sprite_ = Sprite.from(png);
        this.sprite_.x = screen_width / 2;
        this.sprite_.y = screen_heigth / 2;
        this.sprite_.anchor.set(0.5);
        this.sprite_.pivot.set(this.sprite_.width / 2, this.sprite_.height / 2);
        this.sprite_.interactive = true;
        this.sprite_.scale.set(scale);
        this.addChild(this.sprite_);
        this.addChild(this.point_);
    }

    //@ts-ignore
    updateMatrix(angle: number, position: Matrix | null, parent_transformation_matrix: Matrix | null) {
        //console.log("root rotation matrix: " + this.rotation_matrix_);
    }
}