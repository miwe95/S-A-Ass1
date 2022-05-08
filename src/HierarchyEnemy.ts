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
    local_to_world: mat3;
    world_to_local: mat3;
    name_: string;

    constructor(screen_width: number, screen_heigth: number, par: HierarchyEnemy | null, scale: number, offset: number, name:string) {
        super();
        this.name_ = name;
        console.log("parent is: " + par);
        this.parent_ = par;
        this.tmp_vec_ = vec3.create();
        this.rotation_matrix_ = mat3.create();
        this.translation_matrix_ = mat3.create();
        this.transformation_matrix_ = mat3.create();
        this.local_position_ = vec2.create();
        this.local_to_world = mat3.create();
        this.world_to_local = mat3.create();

        this.enemy_ = Sprite.from("enemy.png");
        this.enemy_.interactive = true;
        this.enemy_.scale.set(scale, scale);
        this.enemy_.x = screen_width / 2 + - offset;
        this.enemy_.y = screen_heigth / 2 + offset;

        this.enemy_.anchor.set(0.5);
        this.enemy_.pivot.set(this.enemy_.width / 2, this.enemy_.height / 2);

        this.addChild(this.enemy_);
    }

    //@ts-ignore
    update(dt: number) {
        mat3.fromRotation(this.rotation_matrix_, this.enemy_.rotation);
        mat3.fromTranslation(this.translation_matrix_, vec2.fromValues(this.local_position_[0], this.local_position_[1]));
        //console.log("Translationmatrix: " + this.translation_matrix_);
        if (this.parent_ == null) {
            console.log("hi from " + this.name_);
            this.enemy_.rotation += 2 * dt / 1000;
            //console.log("rotation is " + this.enemy_.rotation);
            //console.log(this.translation_matrix_);
            let cosinus_ = Math.cos(this.enemy_.rotation);
            let sinus_ = Math.sin(this.enemy_.rotation);
            this.rotation_matrix_ = mat3.fromValues(
                cosinus_, sinus_, 0,
                -sinus_, cosinus_, 0,
                0, 0, 1
            );
            this.transformation_matrix_ = this.rotation_matrix_;
            //mat3.multiply(this.transformation_matrix_, this.translation_matrix_, this.rotation_matrix_);
        }
        else {
            console.log("hi from " + this.name_);
            mat3.multiply(this.local_to_world, this.translation_matrix_, this.rotation_matrix_);
            mat3.multiply(this.local_to_world, this.parent_.local_to_world, this.rotation_matrix_);
            mat3.invert(this.world_to_local, this.local_to_world);

            console.log("global: (" + this.enemy_.x + "," + this.enemy_.y + ")");
            //local position
            let local_temp = vec3.create();
            local_temp[0] = this.enemy_.x;
            local_temp[1] = this.enemy_.y;
            local_temp[2] = 1;
            vec3.transformMat3(local_temp, local_temp, this.world_to_local);
            this.local_position_[0] = local_temp[0] / local_temp[2];
            this.local_position_[1] = local_temp[1] / local_temp[2];
            console.log("local: (" + this.local_position_[0] + "," + this.local_position_[1] + ")");

            this.translation_matrix_ = mat3.fromValues(
                1, 0, 0,
                0, 1, 0,
                this.local_position_[0], this.local_position_[1], 1
            );
            //this.enemy_.localTransform.tx+=100;
            //this.enemy_.localTransform.ty+=100;

            mat3.multiply(this.transformation_matrix_, this.translation_matrix_, this.rotation_matrix_);
            mat3.multiply(this.transformation_matrix_, this.parent_!.transformation_matrix_, this.transformation_matrix_);

            let temp_vec = vec3.fromValues(this.parent_.x, this.parent_.y, 1);
            vec3.transformMat3(temp_vec, temp_vec, this.transformation_matrix_);

            this.enemy_.x += temp_vec[0] * 0.2 * dt / 1000;
            this.enemy_.y += temp_vec[1] * 0.2 * dt / 1000;
            //this.enemy_.rotation += 2 * dt / 1000;
        }
    }
}