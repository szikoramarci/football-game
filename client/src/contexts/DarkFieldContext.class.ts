import FieldContext from "./FieldContext.class";
import { Point } from "honeycomb-grid";

export default class DarkFieldContext extends FieldContext {
    constructor(corners: Point[]){
        super(corners);
        this.enableStroke();
        this.setFillColor('#006400');
    }
}