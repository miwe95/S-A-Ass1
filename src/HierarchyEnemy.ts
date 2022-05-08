import { Container, Sprite } from "pixi.js";
import { mat3, vec3, vec2 } from "gl-matrix";
import * as PIXI from 'pixi.js';

export class HierarchyEnemy extends Container {

    enemy_: Sprite;
    parent_: HierarchyEnemy | null;
    rotation_matrix_: mat3;
    transformation_matrix_inverse: mat3;
    translation_matrix_: mat3;
    transformation_matrix_: mat3;
    tmp_vec_: vec3;
    //@ts-ignore
    local_position_: vec2;
    name_: string;
    path_: PIXI.Graphics;
    velocity_x_ : number;
    velocity_y_ : number;
    vCollisionNorm : vec2;
    vCollision : vec2;


    constructor(screen_width: number, screen_heigth: number, par: HierarchyEnemy | null, scale: number, offset: number, name: string) {
        super();
        this.name_ = name;
        console.log("parent is: " + par);
        this.parent_ = par;
        this.tmp_vec_ = vec3.create();
        this.rotation_matrix_ = mat3.create();
        this.translation_matrix_ = mat3.create();
        this.transformation_matrix_ = mat3.create();
        this.transformation_matrix_inverse = mat3.create();
        this.local_position_ = vec2.create();
        this.vCollisionNorm = vec2.create();
        this.vCollision = vec2.create();


        this.enemy_ = Sprite.from("enemy.png");
        this.enemy_.interactive = true;
        this.enemy_.scale.set(scale, scale);
        this.enemy_.x = screen_width / 2 + - offset;
        this.enemy_.y = screen_heigth / 2 + offset;

        this.enemy_.anchor.set(0.5);
        this.enemy_.pivot.set(this.enemy_.width / 2, this.enemy_.height / 2);

        this.path_ = new PIXI.Graphics();
        this.path_.lineStyle(4, 0x5a5e5b, 1);


        this.vCollision[0] = this.enemy_.x - (this.enemy_.x - 1);
        this.vCollision[1] = this.enemy_.y - (this.enemy_.y - 1);
        let distance = Math.sqrt(((this.enemy_.x - 1)-this.enemy_.x)*((this.enemy_.y - 1)-this.enemy_.x) + ((this.enemy_.x - 1)-this.enemy_.y)*((this.enemy_.y - 1)-this.enemy_.y));
        this.vCollisionNorm[0] =  this.vCollision[0] / distance;
        this.vCollisionNorm[1] =  this.vCollision[1] / distance;
        this.velocity_x_ = 0;
        this.velocity_y_ = 0;




        this.addChild(this.path_)
        this.addChild(this.enemy_);
        this.singlestep();
    }

    singlestep() {
        // console.log("hi from" + this.name_);
        // this.enemy_.rotation += 0.1;
        // mat3.fromRotation(this.rotation_matrix_, this.enemy_.rotation);
        // mat3.fromTranslation(this.translation_matrix_, vec2.fromValues(this.enemy_.x, this.enemy_.y));

        // console.log("roation matrix: " + this.rotation_matrix_);
        // console.log("translation matrix " + this.translation_matrix_);

        // mat3.multiply(this.transformation_matrix_, this.translation_matrix_, this.rotation_matrix_);
        // mat3.invert(this.transformation_matrix_inverse, this.transformation_matrix_);
        // console.log("transformation matrix " + this.transformation_matrix_);
        // console.log("transformation matrix inverse " + this.transformation_matrix_inverse);

        // let tmp = vec3.fromValues(this.enemy_.x, this.enemy_.y, 1);
        // vec3.transformMat3(tmp, tmp, this.transformation_matrix_inverse);
        // vec3.transformMat3(tmp, tmp, this.transformation_matrix_);
    }

    //@ts-ignore
    update(dt: number) {
        mat3.fromRotation(this.rotation_matrix_, this.enemy_.rotation);
        mat3.invert(this.rotation_matrix_, this.rotation_matrix_);

        mat3.fromTranslation(this.translation_matrix_, vec2.fromValues(this.enemy_.x, this.enemy_.y));
        mat3.invert(this.translation_matrix_, this.translation_matrix_);
        
        mat3.multiply(this.transformation_matrix_, this.translation_matrix_, this.rotation_matrix_);

        //this.velocity_x_ = (100 * this.vCollisionNorm[0]);
        //this.velocity_y_ = (100 * this.vCollisionNorm[1]);
        //console.log("x " + this.velocity_x_)
        //console.log("y " + this.velocity_y_)

   
        //this.path_.clear();
        //this.path_.moveTo(this.enemy_.x, this.enemy_.y);
        //this.path_.lineTo(this.enemy_.x + 1, this.enemy_.y + 1);

        this.path_.drawCircle(this.enemy_.x, this.enemy_.y, 0.1);
        
        if (this.parent_ == null) {
            this.enemy_.rotation += 3 * dt / 1000;
        }
        else {
            this.enemy_.rotation = this.parent_.enemy_.rotation;
            mat3.multiply(this.transformation_matrix_, this.transformation_matrix_, this.parent_.transformation_matrix_);
            mat3.invert(this.transformation_matrix_inverse, this.transformation_matrix_);
            let tmp = vec3.fromValues(this.enemy_.x, this.enemy_.y, 1);
            vec3.transformMat3(tmp, tmp, this.transformation_matrix_inverse);
            //vec3.transformMat3(tmp,tmp, this.transformation_matrix_);
            this.enemy_.x += tmp[0] * 0.1 * dt / 1000;
            this.enemy_.y += tmp[1] * 0.1 * dt / 1000;
        }
    }
}