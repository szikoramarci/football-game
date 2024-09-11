import FieldContext from "./FieldContext";

export default class DarkFieldContext extends FieldContext {
    constructor(corners){
        super(corners);
        this.enableStroke();
        this.setFillColor('#006400');
    }
}