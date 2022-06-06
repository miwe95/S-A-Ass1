import { Container, Graphics } from "pixi.js";
import * as PIXI from 'pixi.js'; 
//import {vec3, mat3} from "gl-matrix";


export class Voronoi extends Container{

    //private enemy: Sprite;
   //private enemy_texture: Texture;
   private circle: Graphics;


    constructor(_screenWidth: number, _screenHeight: number) {
        super();

        /*this.enemy_texture = PIXI.Texture.from("tetanus_shatter.png");
        this.enemy = new PIXI.Sprite(this.enemy_texture);
        this.enemy.scale.y = 0.1;
        this.enemy.scale.x = 0.1;
        this.enemy.x = (_screenWidth / 2) - 200;
        this.enemy.y = (_screenHeight / 2) - 200;
        this.enemy.anchor.set(0.5);
        this.addChild(this.enemy);*/

        this.circle = new PIXI.Graphics();
        this.circle.beginFill(0xff0000);
        this.circle.drawCircle((_screenWidth / 2) - 200, (_screenHeight / 2) - 200, 40);
        this.circle.position._x = (_screenWidth / 2) - 200;
        this.circle.position._y = (_screenHeight / 2) - 200;
        this.addChild(this.circle);

        this.voronoiShatter(this.circle, 8);

    }

    voronoiShatter(object:Graphics, numberOfCells:number)
    {

        let width = object.getBounds().right;
        let height = object.getBounds().bottom;

        /*console.log("left = " + enemy_texture.orig.left);
        console.log("right = " + enemy_texture.orig.right);
        console.log("top = " + enemy_texture.orig.top);
        console.log("bottom = " + enemy_texture.orig.bottom);*/

        console.log("width = " + width);
        console.log("height = " + height);

        let cells = [];

       /* let impact_point = [enemy.x, enemy.y];
        let impactPosInTextureSpace = [0, 0];

        console.log("x = " + impact_point[0]);
        console.log("y = " + impact_point[1]);

        let tempVec3 = vec3.create();
        let tempMat3 = mat3.create();
        tempVec3[0] = impact_point[0];
        tempVec3[1] = impact_point[1];
        tempVec3[2] = 1;

        vec3.transformMat3(tempVec3, tempVec3, tempMat3);

        impactPosInTextureSpace[0] = tempVec3[0] / tempVec3[2];
        impactPosInTextureSpace[1] = tempVec3[1] / tempVec3[2];

        console.log("x = " + impactPosInTextureSpace[0]);
        console.log("y = " + impactPosInTextureSpace[1]);

        impactPosInTextureSpace[0] = impactPosInTextureSpace[0] * 512 + width * 0.5;
        impactPosInTextureSpace[1] = impactPosInTextureSpace[1] * 512 + height * 0.5;
        
        console.log("x = " + impactPosInTextureSpace[0]);
        console.log("y = " + impactPosInTextureSpace[1]);

       */

        for (let i = 0; i < numberOfCells; i++)
        {

            const radius = Math.sqrt(Math.random()) * Math.max(width, height);
            const angle = Math.random() * (Math.PI + Math.PI);

            let x = object.position._x + radius * Math.cos(angle);
            let y = object.position._y + radius * Math.sin(angle);

            if (x < object.getBounds().left || x > object.getBounds().right || y < object.getBounds().top ||  y > object.getBounds().bottom)
            {
                i--;
                continue;
            } 

            let obj = new PIXI.Graphics();
            obj.beginFill(0x000000);
            obj.drawCircle(x, y, 2);
            this.addChild(obj);

            cells.push({
                pos: [x, y],
                min: [x, y],
                max: [x, y],
                hasPixels: false
            });
        }
    }

}