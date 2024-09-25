import { Injectable } from "@angular/core";
import { Point } from "honeycomb-grid";
import { Application, Container, Graphics } from 'pixi.js';

@Injectable({
    providedIn: 'root'
})
export class AnimateService {

    async move(graphics: Graphics | Container, targetPosition: Point, animationTime: number = 100, aninmationResolution: number = 5) {
        const frameCount = animationTime / aninmationResolution;
        const animationDelay = animationTime / frameCount;
        const movingVectorX = targetPosition.x - graphics.x;
        const movincVectorY = targetPosition.y - graphics.y;            
        for(let i = 0; i < frameCount; i++) {
            if (i > 0) {
                await this.delay(animationDelay);
            }
            graphics.x += movingVectorX/frameCount;
            graphics.y += movincVectorY/frameCount;       
        }        
    }

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}