import * as PIXI from 'pixi.js';

export default class TokenGraphics {
    kitNumber;

    token;
    text;

    constructor(kitNumber){
        this.kitNumber = kitNumber;

        this.generateText();
        this.generateToken();
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
    }

    generateToken(){
        this.token = new PIXI.Graphics().circle(0, 0, 40);  
        this.token.fill('white');
        this.token.stroke( { color: 'black', width: 3 })
    }

    getGraphics() {     
        const graphics = new PIXI.Container();

        this.generateToken();
        this.generateText();

        graphics.addChild(this.token);
        graphics.addChild(this.text);

        graphics.eventMode = 'static';
        graphics.cursor = 'pointer';

        return graphics;
    }
}