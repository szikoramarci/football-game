import GrabbableGraphics from '@/graphics/GrabbableGraphics';
import * as PIXI from 'pixi.js';

export default class TokenGraphics extends GrabbableGraphics {
    kitNumber;

    token;
    text;

    constructor(kitNumber){
        super();

        this.kitNumber = kitNumber;
        
        this.generateToken();
        this.generateText();
        
        return this.getGraphics();
    }


    generateText(){
        this.text = new PIXI.Text({
            text: this.kitNumber,
            style: {
                fill: 'white',
                fontWeight: 'bold',
                fontSize: 40,
                stroke: { color: 'black', width: 7, join: 'round' },
            }
            
        });
        this.text.x = 0 - this.text.bounds.maxX / 2;
        this.text.y = 0 - this.text.bounds.maxY / 2;

        this.graphics.addChild(this.text);
    }

    generateToken(){
        this.token = new PIXI.Graphics().circle(0, 0, 40);  
        this.token.fill('white');
        this.token.stroke( { color: 'black', width: 3 });

        this.graphics.addChild(this.token);
    }

}