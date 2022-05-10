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
        this.child1_ = new HierarchyEnemy(screen_width, screen_height, 0.09, "enemy.png", this.child2_);
        this.root_ = new HierarchyEnemy(screen_width, screen_height, 0.1, "black_hole.png", this.child1_);
        this.addChild(this.child1_);
        this.addChild(this.child2_);
        this.addChild(this.child3_);
        this.addChild(this.root_);

        this.rotation_speed_ = 0.78;
        this.rotation_angle_ = 0;
        this.count_ = 0;
    }

    updateNode(angle: number, parent_transformation: mat3, node: HierarchyEnemy) {

        let rotation_matrix = mat3.fromValues(Math.cos(angle), Math.sin(angle), 0, -Math.sin(angle), Math.cos(angle), 0, 0, 0, 1);
        //node.rotation_angle = node.rotation_angle + angle
        mat3.multiply(node.local_transformation_matrix, rotation_matrix ,node.local_transformation_matrix);
        console.log("local trans mat" + node.local_transformation_matrix);
        mat3.multiply(node.transformation_matrix_, node.local_transformation_matrix, parent_transformation);
        console.log("global trans mat" + node.transformation_matrix_);
        node.sprite_.rotation += angle;
        let pos = vec3.fromValues(0, 0, 1);
        vec3.transformMat3(pos, pos, node.transformation_matrix_);
        console.log(pos[0]);
        console.log(pos[1]);
        node.sprite_.x = pos[0];
        node.sprite_.y = pos[1];
        //console.log(node.globalTransMat);
        //console.log("movement x: " + xy[0]);
        //console.log("movement y: " + xy[1]);

        if (node.child_ != null)
            this.updateNode(angle, node.transformation_matrix_, node.child_);

    }

    //@ts-ignore
    update(dt: number) {
        if (this.count_ != 2) {
            //this.root_.sprite_.rotation += this.rotation_speed_ * dt / 1000;
            this.rotation_angle_ = this.rotation_speed_ * dt / 1000;
            //console.log(this.rotation_speed_ * dt / 1000);
            //this.root_.sprite_.x += 50 * dt / 1000;
            this.updateNode(this.rotation_angle_, mat3.fromValues(1, 0, 0, 0, 1, 0, this.root_.sprite_.x, this.root_.sprite_.y, 1), this.root_.child_!);
            //this.child1_.updateMatrix(this.rotation_angle_ , null, this.root_.transformation_matrix_);
            //this.child2_.updateMatrix(this.rotation_angle_, null, this.child1_.transformation_matrix_); 
            //this.child3_.updateMatrix(this.rotation_angle_, null, this.child2_.transformation_matrix_); 
            this.count_ = 1;
        }
    }
}