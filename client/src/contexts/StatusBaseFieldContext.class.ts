import FieldContext from "./FieldContext.class";
import { Point } from "honeycomb-grid";

export default class StatusBaseFieldContext extends FieldContext {
    constructor(corners: Point[]){
        super(corners);
    }
}