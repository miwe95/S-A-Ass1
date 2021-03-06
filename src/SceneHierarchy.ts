import { mat3 } from "gl-matrix";
import { Container } from "pixi.js";
import { HierarchyEnemy } from "./HierarchyEnemy";

export class SceneHierarchy extends Container {

    root_: HierarchyEnemy;
    child1_: HierarchyEnemy;
    child11_: HierarchyEnemy;
    child2_: HierarchyEnemy;
    child3_: HierarchyEnemy;
    rotation_speed_: number;
    rotation_angle_: number;
    count_: number;
    screen_width: number;
    screen_height: number;

    constructor(screen_width: number, screen_height: number) {
        super();
        this.screen_width = screen_width;
        this.screen_height = screen_height;
        this.child3_ = new HierarchyEnemy(screen_width, screen_height, 0.02, "enemy_green.png", null);
        this.child2_ = new HierarchyEnemy(screen_width, screen_height, 0.04, "enemy_red.png", this.child3_);
        this.child1_ = new HierarchyEnemy(screen_width, screen_height, 0.09, "enemy_black.png", this.child2_);
        this.child11_ = new HierarchyEnemy(screen_width, screen_height, 0.09, "enemy_black.png", this.child2_);
        this.root_ = new HierarchyEnemy(screen_width, screen_height, 0.1, "black_hole.png", this.child1_);
        this.addChild(this.child1_);
        this.addChild(this.child11_);
        this.addChild(this.child2_);
        this.addChild(this.child3_);
        this.addChild(this.root_);

        this.child1_.local_position_[0] = 100;
        this.child1_.local_position_[1] = 100;
        mat3.fromTranslation(this.child1_.local_translation_matrix, this.child1_.local_position_);

        this.child11_.local_position_[0] = -100;
        this.child11_.local_position_[1] = -100;
        mat3.fromTranslation(this.child11_.local_translation_matrix, this.child11_.local_position_);

        this.child2_.local_position_[0] = 100;
        this.child2_.local_position_[1] = 100;
        mat3.fromTranslation(this.child2_.local_translation_matrix, this.child2_.local_position_);

        this.child3_.local_position_[0] = 50;
        this.child3_.local_position_[1] = 50;
        mat3.fromTranslation(this.child3_.local_translation_matrix, this.child3_.local_position_);

        this.rotation_speed_ = 0.5;
        this.rotation_angle_ = 0;
        this.count_ = 0;
    }

    //increases the radius (local position) enemys fly around the black hole
    increaseRadius(dt: number, _val: number) {
        this.child1_.local_position_[0] += _val * dt / 1000;
        this.child1_.local_position_[1] += _val * dt / 1000;
        mat3.fromTranslation(this.child1_.local_translation_matrix, this.child1_.local_position_);

        this.child11_.local_position_[0] -= _val * dt / 1000;
        this.child11_.local_position_[1] -= _val * dt / 1000;
        mat3.fromTranslation(this.child11_.local_translation_matrix, this.child11_.local_position_);
    }

    //reduce the radius (local position) enemys fly around the black hole
    decreaseRadius(dt: number) {
        this.child1_.local_position_[0] -= 100 * dt / 1000;
            this.child1_.local_position_[1] -= 100 * dt / 1000;
            mat3.fromTranslation(this.child1_.local_translation_matrix, this.child1_.local_position_);

            this.child11_.local_position_[0] += 100 * dt / 1000;
            this.child11_.local_position_[1] += 100 * dt / 1000;
            mat3.fromTranslation(this.child11_.local_translation_matrix, this.child11_.local_position_);
    }

   
    //@ts-ignore
    update(dt: number) {
        this.rotation_angle_ += this.rotation_speed_ * dt / 1000;

        var identity = mat3.create();
        mat3.identity(identity);

        this.root_.updateMatrix(this.rotation_angle_, identity, 0);
        this.child1_.updateMatrix(this.rotation_angle_ * 2, this.root_.global_transformation_matrix_, this.root_.sprite_.rotation);
        this.child11_.updateMatrix(this.rotation_angle_ * 2, this.root_.global_transformation_matrix_, this.root_.sprite_.rotation);
        this.child2_.updateMatrix(this.rotation_angle_ * 4, this.child1_.global_transformation_matrix_, this.root_.sprite_.rotation);
        this.child3_.updateMatrix(this.rotation_angle_ * 6, this.child2_.global_transformation_matrix_, this.root_.sprite_.rotation);

    }
}