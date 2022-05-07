import { Container, Sprite } from "pixi.js";
import { mat3, vec3, vec2 } from "gl-matrix";

export class HierarchyEnemy extends Container {

    enemy_: Sprite;
    parent_: HierarchyEnemy | null;
    rotation_matrix_: mat3;
    translation_matrix_: mat3;
    transformation_matrix_: mat3;
    tmp_vec_: vec3;
    //@ts-ignore
    local_position_: vec2;

    constructor(screen_width: number, screen_heigth: number, parent: HierarchyEnemy | null, scale: number, offset: number) {
        super();

        this.parent_ = parent;
        this.tmp_vec_ = vec3.create();
        this.rotation_matrix_ = mat3.create();
        this.translation_matrix_ = mat3.create();
        this.transformation_matrix_ = mat3.create();
        this.local_position_ = vec2.create();

        this.enemy_ = Sprite.from("enemy.png");
        this.enemy_.interactive = true;
        this.enemy_.scale.set(scale, scale);
        this.enemy_.x = screen_width / 2;
        this.enemy_.y = screen_heigth / 2 + offset;
        this.enemy_.pivot.set(screen_width / 2, screen_heigth / 2 + offset);
        //this.enemy_.anchor.set(0.5);
        this.addChild(this.enemy_);
    }

    //@ts-ignore
    update(dt: number) {
        mat3.fromRotation(this.rotation_matrix_, this.enemy_.rotation);
        mat3.fromTranslation(this.translation_matrix_, vec2.fromValues(this.enemy_.x, this.enemy_.y));
        if (this.parent_ == null) {
            this.enemy_.rotation += 1 * dt / 1000;
            //console.log("rotation is " + this.enemy_.rotation);
            //console.log(this.translation_matrix_);
            let cosinus_ = Math.cos(this.enemy_.rotation);
            let sinus_ = Math.sin(this.enemy_.rotation);
            this.rotation_matrix_ = mat3.fromValues(
                cosinus_, sinus_, 0,
                -sinus_, cosinus_, 0,
                0, 0, 1
            );

            mat3.multiply(this.transformation_matrix_, this.rotation_matrix_, this.translation_matrix_);
            let temp_vec = vec3.fromValues(0, 0, 1);
            vec3.transformMat3(temp_vec, temp_vec, this.transformation_matrix_);
            console.log(temp_vec);
        }
        else {
            this.translation_matrix_ = mat3.fromValues(
                1,0,0,
                0,1,0,
                this.enemy_.x,this.enemy_.y,1
            );

            mat3.multiply(this.transformation_matrix_, this.rotation_matrix_, this.translation_matrix_);
            mat3.multiply(this.transformation_matrix_, this.transformation_matrix_, this.parent_!.transformation_matrix_);

            let temp_vec = vec3.fromValues(0, 0, 1);
            vec3.transformMat3(temp_vec, temp_vec, this.transformation_matrix_);
            this.enemy_.x += temp_vec[0] * dt / 1000;
            this.enemy_.y += temp_vec[1] * dt / 1000;
        }
    }
}