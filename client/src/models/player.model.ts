export class Player {
    id: string = "";
    kitNumber: string = "";
    name: string = "";

    constructor(name: string, kitNumber: string) {
        this.id = btoa(name);
        this.name = name;
        this.kitNumber = kitNumber;
    }
}