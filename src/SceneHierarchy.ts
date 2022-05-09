import { vec2 } from "gl-matrix";
import { Container} from "pixi.js";
import { HierarchyEnemy } from "./HierarchyEnemy";


export class SceneHierarchy extends Container{
    
    root_: HierarchyEnemy;
    child1_: HierarchyEnemy;
    child2_: HierarchyEnemy;
    child3_: HierarchyEnemy;
    rotation_speed_: number;

    constructor(screen_width: number, screen_height: number){
        super();
        this.child3_ = new HierarchyEnemy(screen_width, screen_height, 0.02, "enemy.png", null);
        this.child2_ = new HierarchyEnemy(screen_width, screen_height, 0.04, "enemy.png", this.child3_);
        this.child1_ = new HierarchyEnemy(screen_width, screen_height, 0.09, "enemy.png", this.child2_);
        this.root_ = new HierarchyEnemy(screen_width, screen_height, 0.1, "black_hole.png", this.child1_);
        this.addChild(this.child1_);
        this.addChild(this.child2_);
        this.addChild(this.child3_);
        this.addChild(this.root_);
        this.rotation_speed_ = 1;
    }

    //@ts-ignore
    update(dt: number){
        this.root_.sprite_.rotation += this.rotation_speed_ * dt / 1000; 
        //this.root_.sprite_.x += 50 * dt / 1000;
        this.root_.updateMatrix(this.root_.sprite_.rotation, vec2.fromValues(this.root_.sprite_.x, this.root_.sprite_.y), null, dt);

        this.child1_.updateMatrix(this.root_.sprite_.rotation, vec2.fromValues(this.child1_.sprite_.x, this.child1_.sprite_.y), this.root_.transformation_matrix_, dt);
        this.child2_.updateMatrix(this.child1_.sprite_.rotation, vec2.fromValues(this.child2_.sprite_.x, this.child2_.sprite_.y), this.child1_.transformation_matrix_, dt); 
        this.child3_.updateMatrix(this.child2_.sprite_.rotation, vec2.fromValues(this.child3_.sprite_.x, this.child3_.sprite_.y), this.child2_.transformation_matrix_, dt); 
    }
}