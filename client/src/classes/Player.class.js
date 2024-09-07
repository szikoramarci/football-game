import * as PIXI from 'pixi.js';

export default class Player {
    x;
    y;
    kitNumber;

    token;
    text;

    constructor(x, y, kitNumber){
        this.x = x;
        this.y = y;
        this.kitNumber = kitNumber;
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

        graphics.on('pointerenter', () => {
            graphics.scale.set(1.1);
        });

        graphics.on('pointerleave', () => {
            graphics.scale.set(1);
        })

        return graphics;
    }
}