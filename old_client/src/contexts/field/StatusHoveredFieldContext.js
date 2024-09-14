import FieldContext from "./FieldContext";

export default class StatusHoveredFieldContext extends FieldContext {
    constructor(corners){
        super(corners);
        this.setFillColor({
            color: 'white',
            alpha: 0.4,
        });
    }
}