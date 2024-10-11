import { Injectable } from "@angular/core";
import { Graphics, Point, StrokeStyle } from "pixi.js";
import { MOVEMENT_PATH_WIDTH, PASSING_PATH_WITH } from "../../constants";
import { CoordinateService } from "../coordinate/coordinate.service";

@Injectable({
    providedIn: 'root'
})
export class DrawService {

    constructor(private coordinate: CoordinateService) {}

    drawPassingPathArrowLine(graphics: Graphics, line: Point[]){
        const color = "white";
        const style = { width: PASSING_PATH_WITH, color: color };

        this.drawLine(graphics, line, style);  
        this.drawArrowHeadForLine(graphics, line, color, PASSING_PATH_WITH * 10);   
    }    

    drawMovingPathArrowLine(graphics: Graphics, lines: Point[][]) {
        if (lines.length == 0) return;

        const lastLine = lines[lines.length - 1]
        lines.forEach(line => {
            this.drawDashedLine(graphics, line);            
        })
        this.drawArrowHeadForLine(graphics, lastLine);
    }
    
    drawArrowHeadForLine(graphics: Graphics, line: Point[], fillColor: string = 'white', size: number = MOVEMENT_PATH_WIDTH * 7) {
        const halfBase = size / 2;

        const endPoint: Point = line[1];

        const angle = this.coordinate.calculateAngle(line[0],line[1]);
        
        const offsetX = Math.cos(angle) * halfBase;  
        const offsetY = Math.sin(angle) * halfBase;

        const x = endPoint.x + offsetX;
        const y = endPoint.y + offsetY;

        // Coordinates of the triangle's vertices
        const p1 = { x: x, y: y };
        const p2 = { x: x - Math.cos(angle - Math.PI / 6) * size, y: y - Math.sin(angle - Math.PI / 6) * size };
        const p3 = { x: x - Math.cos(angle + Math.PI / 6) * size, y: y - Math.sin(angle + Math.PI / 6) * size };

        // Draw the triangle        
        graphics.moveTo(p1.x, p1.y);
        graphics.lineTo(p2.x, p2.y);
        graphics.lineTo(p3.x, p3.y);
        graphics.lineTo(p1.x, p1.y);
        graphics.fill(fillColor);
        
    }

    drawLine(graphics: Graphics, line: Point[], strokeStyle: StrokeStyle = { width: MOVEMENT_PATH_WIDTH, color: 'white' }) {
        const [startPoint, endPoint] = line;

        graphics.moveTo(startPoint.x, startPoint.y);
        graphics.lineTo(endPoint.x, endPoint.y);

        graphics.stroke(strokeStyle);
    }

    drawDashedLine(
        graphics: Graphics, 
        line: Point[], 
        strokeStyle: StrokeStyle = { width: MOVEMENT_PATH_WIDTH, color: 'white' }, 
        dashLength: number = MOVEMENT_PATH_WIDTH, 
        gapLength: number = MOVEMENT_PATH_WIDTH
    ): void {
        const [startPoint, endPoint] = line;
        const totalLength = Math.hypot(endPoint.x - startPoint.x, endPoint.y - startPoint.y); // Calculate the total length of the line
        const angle = this.coordinate.calculateAngle(startPoint, endPoint); // Calculate the angle of the line
        const cycleLength = dashLength + gapLength;
        const numFullCycles = Math.floor(totalLength / cycleLength);
        const remainingLength = totalLength - numFullCycles * cycleLength;
        
        if (remainingLength > 0) {
            const dashRatio = cycleLength / dashLength;
            const gapRatio = cycleLength / gapLength;            
            const adjustedDashLength = dashLength + remainingLength / numFullCycles * dashRatio;
            const adjustedGapLength = gapLength + remainingLength / numFullCycles * gapRatio;
    
            dashLength = adjustedDashLength;
            gapLength = adjustedGapLength;
        }

        let currentLength = 0;                
        while (currentLength < totalLength) {
            // Calculate start point of the dash
            const dashStartX = startPoint.x + Math.cos(angle) * currentLength;
            const dashStartY = startPoint.y + Math.sin(angle) * currentLength;
    
            // Move progress forward by dash length
            currentLength += dashLength;
    
            // Calculate end point of the dash
            const dashEndX = startPoint.x + Math.cos(angle) * Math.min(currentLength, totalLength);
            const dashEndY = startPoint.y + Math.sin(angle) * Math.min(currentLength, totalLength);
    
            // Draw the dash
            graphics.moveTo(dashStartX, dashStartY);
            graphics.lineTo(dashEndX, dashEndY);
    
            // Move progress forward by gap length
            currentLength += gapLength;
        }

        graphics.stroke(strokeStyle); // Set line style (width, color, etc.)
    }
    
}