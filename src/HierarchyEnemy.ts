import { Container, Graphics, Sprite } from "pixi.js";
//import { mat3, vec2, vec3 } from "gl-matrix";
import { mat3, vec2, vec3 } from "gl-matrix";
import { EnemyHandler } from './EnemyHandler';

export class HierarchyEnemy extends Container {

    sprite_: Sprite;
    global_transformation_matrix_: mat3;
    local_transformation_matrix: mat3;
    local_rotation_matrix: mat3;
    local_translation_matrix: mat3;
    child_: HierarchyEnemy | null;
    point_: Graphics;
    screen_width_: number;
    screen_height_: number;
    local_position_: vec2;

    constructor(screen_width: number, screen_heigth: number, scale: number, png: string, child: HierarchyEnemy | null) {
        super();

        this.global_transformation_matrix_ = mat3.create();
        this.local_transformation_matrix = mat3.create();
        this.local_rotation_matrix = mat3.create();
        this.local_translation_matrix = mat3.create();
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
        EnemyHandler.getInstance().addSpriteToCollection(this.sprite_);
        this.addChild(this.sprite_);
        this.addChild(this.point_);
        this.local_position_ = vec2.fromValues(-50,-50);
    }

    //@ts-ignore
    updateMatrix(angle: number, parent_transformation_matrix: Matrix, parent_angle: number) {
        mat3.fromRotation(this.local_rotation_matrix, angle);
        mat3.multiply(this.local_transformation_matrix, this.local_translation_matrix, this.local_rotation_matrix);
        mat3.multiply(this.global_transformation_matrix_, parent_transformation_matrix, this.local_transformation_matrix);
        
        let pos = vec3.fromValues(0, 0, 1);
        vec3.transformMat3(pos, pos, this.global_transformation_matrix_);
        if(parent_angle != 0)
        {
            this.sprite_.x = pos[0] + this.screen_width_ /2;
            this.sprite_.y = pos[1] + this.screen_height_ /2;
        }
        this.sprite_.rotation = parent_angle + angle;
    }
}