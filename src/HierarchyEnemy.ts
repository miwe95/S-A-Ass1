import { Container, Graphics, Sprite } from "pixi.js";
//import { mat3, vec2, vec3 } from "gl-matrix";
import { Matrix } from 'ml-matrix';

export class HierarchyEnemy extends Container {

    sprite_: Sprite;
    rotation_matrix_: Matrix;
    translation_matrix_: Matrix;
    transformation_matrix_: Matrix;
    local_transformation_matrix: Matrix;
    tmp_matrix: Matrix;
    child_: HierarchyEnemy | null;
    point_: Graphics;
    screen_width_: number;
    screen_height_: number;

    constructor(screen_width: number, screen_heigth: number, scale: number, png: string, child: HierarchyEnemy | null) {
        super();

        this.rotation_matrix_ = Matrix.eye(3,3);
        this.translation_matrix_ = Matrix.eye(3,3);
        this.transformation_matrix_ = Matrix.eye(3,3);
        this.local_transformation_matrix = Matrix.eye(3,3);
        this.tmp_matrix = Matrix.eye(3,3);
        this.tmp_matrix = Matrix.eye(3,3);
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

    updateMatrix(angle: number, position: Matrix | null, parent_transformation_matrix: Matrix | null) {
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        this.rotation_matrix_ = new Matrix([[cos, sin, 0],[-sin, cos, 0],[0,0,1]]);
        this.sprite_.rotation += 0.007;
        if (parent_transformation_matrix != null) {
            console.log("child1 parents trans mat" + parent_transformation_matrix);
            this.local_transformation_matrix = this.translation_matrix_.mmul(this.rotation_matrix_);
            this.transformation_matrix_ = parent_transformation_matrix.mmul(this.local_transformation_matrix);
            //console.log(this.transformation_matrix_);
            console.log("child1 transformation matrix " + this.transformation_matrix_);
            let vec_ = new Matrix([[0,0,1]]);
            vec_ = vec_.mmul(this.transformation_matrix_);
            this.sprite_.x = vec_.get(0,0) + this.screen_height_ /2+ 100;
            this.sprite_.y = vec_.get(0,1) + this.screen_width_ / 2 -100;
            //this.point_.drawCircle(this.sprite_.x, this.sprite_.y, 1);
            console.log("child1 vec0 and vec1: " + vec_.get(0,0) + " " + vec_.get(0,1));
        }

        else {
            if (position != null) {
                this.tmp_matrix = new Matrix([[1, 0, 0],[0, 1, 0],[100, 100, 1]]);
                //console.log("root tmp " +    this.tmp_matrix);
                //console.log("root rot" + this.rotation_matrix_);
                this.transformation_matrix_ = this.tmp_matrix.mmul(this.rotation_matrix_);
                //console.log("root transformation matrix" + this.transformation_matrix_);
                //mat3.multiply(this.transformation_matrix_, this.translation_matrix_, this.rotation_matrix_ );
            }
        }




        //console.log("root rotation matrix: " + this.rotation_matrix_);
    }
}