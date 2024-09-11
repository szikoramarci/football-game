import FieldContext from "./FieldContext";

export default class LightFieldContext extends FieldContext {
    constructor(corners){
        super(corners);
        this.enableStroke();
        this.setFillColor('#7CFC00');
    }
}