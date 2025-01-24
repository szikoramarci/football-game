import FieldContext from "./FieldContext.class";
import { Point } from "@szikoramarci/honeycomb-grid";

export default class PassingIndicatorContext extends FieldContext {
    constructor(corners: Point[]){
        super(corners);
        this.setFillColor({
            color: '#FF00FF',
            alpha: 0.4,
        });
    }
}