import * as PIXI from 'pixi.js';

export default class TokenGraphics {
    x = 0;
    y = 0;
    kitNumber;

    token;
    text;

    constructor(kitNumber){
        this.kitNumber = kitNumber;

        this.generateText();
        this.generateToken();
        return this.getGraphics();
    }

    setPosition(x, y){
        this.x = x;
        this.y = y;
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
        this.text.x = this.x - this.text.bounds.maxX / 2;
        this.text.y = this.y - this.text.bounds.maxY / 2;
    }

    generateToken(){
        this.token = new PIXI.Graphics().circle(this.x, this.y, 40);  
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

        graphics.position.x = this.x;
        graphics.position.y = this.y;

        graphics.pivot.x = this.x;
        graphics.pivot.y = this.y;

        return graphics;
    }
}