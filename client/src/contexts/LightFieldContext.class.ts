import FieldContext from "./FieldContext.class";
import { Point } from "@szikoramarci/honeycomb-grid";

export default class LightFieldContext extends FieldContext {
    constructor(corners: Point[]){
        super(corners);
        this.enableStroke();
        this.setFillColor('#7CFC00');
    }
}