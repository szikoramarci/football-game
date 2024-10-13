import FieldContext from "./FieldContext.class";
import { Point } from "honeycomb-grid";

export default class MovementIndicatorContext extends FieldContext {
    constructor(corners: Point[]){
        super(corners);
        this.setFillColor({
            color: 'blue',
            alpha: 0.4,
        });
    }
}