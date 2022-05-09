import Matrix from "ml-matrix";
import { Container} from "pixi.js";
import { HierarchyEnemy } from "./HierarchyEnemy";


export class SceneHierarchy extends Container{
    
    root_: HierarchyEnemy;
    child1_: HierarchyEnemy;
    child2_: HierarchyEnemy;
    child3_: HierarchyEnemy;
    rotation_speed_: number;
    rotation_angle_: number;
    count_:number;

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
        this.rotation_speed_ = 0.8;
        this.rotation_angle_ = 0;
        this.count_ = 0;
    }

    //@ts-ignore
    update(dt: number){
        if(this.count_ !=2)
        {
            //this.root_.sprite_.rotation += this.rotation_speed_ * dt / 1000;
            this.rotation_angle_ += this.rotation_speed_ * dt / 1000;
            //console.log(this.rotation_speed_ * dt / 1000);
            //this.root_.sprite_.x += 50 * dt / 1000;
            this.root_.updateMatrix(this.rotation_angle_, new Matrix([]), null);
            this.child1_.updateMatrix(this.rotation_angle_ , null, this.root_.transformation_matrix_);
            this.child2_.updateMatrix(this.rotation_angle_, null, this.child1_.transformation_matrix_); 
            this.child3_.updateMatrix(this.rotation_angle_, null, this.child2_.transformation_matrix_); 
            this.count_ = 1;
        }
    }
}