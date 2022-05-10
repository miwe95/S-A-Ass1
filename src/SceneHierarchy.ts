import { mat3, vec3 } from "gl-matrix";
import { Container } from "pixi.js";
import { HierarchyEnemy } from "./HierarchyEnemy";


export class SceneHierarchy extends Container {

    root_: HierarchyEnemy;
    child1_: HierarchyEnemy;
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
        this.child3_ = new HierarchyEnemy(screen_width, screen_height, 0.02, "enemy.png", null);
        this.child2_ = new HierarchyEnemy(screen_width, screen_height, 0.04, "enemy.png", this.child3_);
        this.child1_ = new HierarchyEnemy(screen_width+500, screen_height, 0.09, "enemy.png", this.child2_);
        this.root_ = new HierarchyEnemy(screen_width+500, screen_height, 0.1, "black_hole.png", this.child1_);
        this.addChild(this.child1_);
        this.addChild(this.child2_);
        this.addChild(this.child3_);
        this.addChild(this.root_);

        this.rotation_speed_ = 0.7;
        this.rotation_angle_ = 0;
        this.count_ = 0;
    }

    //@ts-ignore
    update(dt: number) {


            this.rotation_angle_ = this.rotation_speed_ * dt / 1000;

            let parent_transformation = mat3.fromValues(1, 0, 0, 0, 1, 0, this.root_.sprite_.x, this.root_.sprite_.y, 1);

            mat3.multiply(this.child1_.local_transformation_matrix, this.child1_.rotation_matrix ,this.child1_.local_transformation_matrix);

            mat3.multiply(parent_transformation, parent_transformation, this.child1_.local_transformation_matrix);
    
            this.child1_.sprite_.rotation = this.rotation_angle_;
            let pos = vec3.fromValues(100, 100, 1);
            vec3.transformMat3(pos, pos, parent_transformation);
    
            this.child1_.sprite_.x = pos[0];
            this.child1_.sprite_.y = pos[1];


        
            let parent_transformation2 = mat3.fromValues(1, 0, 0, 0, 1, 0, this.child1_.sprite_.x, this.child1_.sprite_.y, 1);

    
            mat3.multiply(this.child2_.local_transformation_matrix, this.child2_.rotation_matrix ,this.child2_.local_transformation_matrix);

            mat3.invert(this.child2_.local_transformation_matrix ,this.child2_.local_transformation_matrix );
    
            mat3.multiply(parent_transformation2, parent_transformation2, this.child2_.local_transformation_matrix);
  
            //mat3.invert(parent_transformation2 ,parent_transformation2 );
            this.child2_.sprite_.rotation = this.rotation_angle_;

            mat3.invert(this.child2_.rotation_matrix ,this.child2_.rotation_matrix );

    
            let pos1 = vec3.fromValues(100, 100, 1);
            vec3.transformMat3(pos1, pos1, parent_transformation2);
    
            this.child2_.sprite_.x = pos1[0];
            this.child2_.sprite_.y = pos1[1];

    }
}