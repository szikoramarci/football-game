import FieldContext from "./FieldContext";

export default class DarkFieldContext extends FieldContext {
    constructor(corners){
        super(corners);
        this.setFillColor('#006400');
    }
}