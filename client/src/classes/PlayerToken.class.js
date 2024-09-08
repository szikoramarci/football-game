import TokenGraphics from "./graphics/TokenGraphics.class"
 

export default class PlayerToken {
    player;
    tokenGraphics;
    grabbed = false;

    constructor(player) {
        this.player = player;
        this.tokenGraphics = new TokenGraphics(player.kitNumber);        
    }

    setPosition(x, y){
        this.tokenGraphics.x = x;
        this.tokenGraphics.y = y;
    }

    getGraphics() {
        return this.tokenGraphics;
    }
}