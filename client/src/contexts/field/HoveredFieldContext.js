import FieldContext from "./FieldContext";

export default class HoveredFieldContext extends FieldContext {
    constructor(corners){
        super(corners);
        this.setFillColor('red');
    }
}