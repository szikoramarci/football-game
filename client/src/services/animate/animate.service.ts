import { Injectable } from "@angular/core";
import { Point } from "honeycomb-grid";
import { Container, Graphics } from 'pixi.js';

@Injectable({
    providedIn: 'root'
})
export class AnimateService {

    async move(graphics: Graphics | Container, targetPosition: Point, animationTime: number = 100, frameCount: number = 4) {
        const animationDelay = animationTime / frameCount;
        const movingVectorX = (targetPosition.x - graphics.x) / frameCount;
        const movingVectorY = (targetPosition.y - graphics.y) / frameCount;            
        for(let i = 0; i < frameCount; i++) {
            if (i > 0) {
                await this.delay(animationDelay);
            }
            graphics.x += movingVectorX;
            graphics.y += movingVectorY;                   
        }        

        // TO GET THE TARGET FOR SURE
        graphics.x = targetPosition.x;
        graphics.y = targetPosition.y;
    }

    async bounce(graphics: Graphics | Container, targetPosition: Point) {
        const originalPosition: Point = { x: graphics.x, y: graphics.y }
        this.move(graphics, targetPosition, 150).then(() => {
            this.move(graphics, originalPosition, 150)
        })        
    }

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}