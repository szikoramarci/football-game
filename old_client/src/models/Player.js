import TokenGraphics from "@/graphics/TokenGraphics";

export default class Player {
    id;
    team;
    kitNumber;
    name;
    attributes;

    token;

    constructor(name, kitNumber) {
        this.id = btoa(name);
        this.name = name;
        this.kitNumber = kitNumber;

        this.initPlayerToken();
    }

    initPlayerToken(){
        this.token = new TokenGraphics(this.kitNumber);
    }
    
    getGraphics() {
        return this.token;
    }
}