import { Injectable } from "@angular/core";
import { Graphics, Point, StrokeStyle } from "pixi.js";

@Injectable({
    providedIn: 'root'
})
export class DrawService {

    calculateAngle(line: Point[]): number {
        const startPoint: Point = line[0];
        const endPoint: Point = line[1];
        return Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
    }

    drawPathArrowLine(graphics: Graphics, lines: Point[][]) {
        if (lines.length == 0) return;

        const lastLine = lines[lines.length - 1]
        lines.forEach(line => {
            this.drawDashedLine(graphics, line);            
        })
        this.drawArrowHeadForLine(graphics, lastLine);
    }
    
    drawArrowHeadForLine(graphics: Graphics, line: Point[], size: number = 30) {
        const halfBase = size / 2;

        const endPoint: Point = line[1];

        const angle = this.calculateAngle(line);
        
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
        graphics.fill(0x000000);
        
    }

    drawDashedLine(
        graphics: Graphics, 
        line: Point[], 
        strokeStyle: StrokeStyle = { width: 4, color: 0x000000 }, 
        dashLength: number = 5, 
        gapLength: number = 5
    ): void {
        const [startPoint, endPoint] = line;
        const totalLength = Math.hypot(endPoint.x - startPoint.x, endPoint.y - startPoint.y); // Calculate the total length of the line
        const angle = this.calculateAngle([startPoint, endPoint]); // Calculate the angle of the line
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

        graphics.stroke( strokeStyle); // Set line style (width, color, etc.)
    }
}