import { Container } from "pixi.js";
import { mat3, vec2, vec3 } from "gl-matrix";

export class Transform extends Container {

    parent_transform: Transform | null;
    rotation_matrix: mat3;
    translation_matrix: mat3;
    transformation_matrix: mat3;
    cosinus: number;
    sinus: number;
    tmp_vec: vec3;
    //@ts-ignore
    position: vec2;

    //@ts-ignore
    constructor(screen_width: number, screen_heigth: number, parent_transform: Transform | null) {
        super();

        this.parent_transform = parent_transform ?? null;
        this.cosinus = Math.cos(0);
        this.sinus = Math.sin(0);
        this.tmp_vec = vec3.create();
        this.rotation_matrix = mat3.create();
        this.translation_matrix = mat3.create();
        this.transformation_matrix = mat3.create();
        this.position = vec2.create();

        if (this.parent_transform == null) {
            this.rotation_matrix = mat3.fromValues(
                this.cosinus, this.sinus, 0,
                -this.sinus, this.cosinus, 0,
                0, 0, 1
            );

            this.translation_matrix = mat3.fromValues(
                1, 0, 0,
                0, 1, 0,
                0, 0, 1
            );
        }
        else {
            mat3.multiply(this.transformation_matrix, this.rotation_matrix, this.translation_matrix);
            mat3.multiply(this.transformation_matrix, this.transformation_matrix, parent_transform!.transformation_matrix);
        }
    }

    update(_delta: number) {

    }
}