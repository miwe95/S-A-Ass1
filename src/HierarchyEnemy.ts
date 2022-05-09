import { Container, Sprite } from "pixi.js";
import { mat3, vec2, vec3 } from "gl-matrix";

export class HierarchyEnemy extends Container {

    sprite_: Sprite;
    rotation_matrix_: mat3;
    translation_matrix_: mat3;
    transformation_matrix_: mat3;
    transformation_matrix_inverse_: mat3;
    child_: HierarchyEnemy | null;

    constructor(screen_width: number, screen_heigth: number, scale: number, png: string, child: HierarchyEnemy | null) {
        super();

        this.rotation_matrix_ = mat3.create();
        this.translation_matrix_ = mat3.create();
        this.transformation_matrix_ = mat3.create();
        this.transformation_matrix_inverse_ = mat3.create();
        this.child_ = child;

        this.sprite_ = Sprite.from(png);
        this.sprite_.x = screen_width / 2;
        this.sprite_.y = screen_heigth / 2;
        this.sprite_.anchor.set(0.5);
        this.sprite_.pivot.set(this.sprite_.width / 2, this.sprite_.height / 2);
        this.sprite_.interactive = true;
        this.sprite_.scale.set(scale);
        this.addChild(this.sprite_);
    }

    //@ts-ignore
    updateMatrix(angle: number, position: vec2, parent_transformation_matrix: mat3 | null, dt) {
        mat3.fromRotation(this.rotation_matrix_, angle);
        mat3.fromTranslation(this.translation_matrix_, vec2.fromValues(position[0], position[1]));
       
        //console.log(this.translation_matrix_);
        mat3.multiply(this.transformation_matrix_, this.rotation_matrix_, this.translation_matrix_);
        if(parent_transformation_matrix != null){
            mat3.multiply(this.transformation_matrix_, parent_transformation_matrix, this.transformation_matrix_);
            let vec_ = vec3.fromValues(0,0,1);
            vec3.transformMat3(vec_, vec_, this.transformation_matrix_);
            this.sprite_.x += vec_[0] * 0.1 * dt / 1000;
            this.sprite_.y += vec_[1] * 0.1 *  dt / 1000;
            this.sprite_.rotation = angle;
        }

        

        //console.log("root rotation matrix: " + this.rotation_matrix_);
    }
}