import FieldContext from "./FieldContext.class";
import { Point } from "honeycomb-grid";

export default class StatusHoveredFieldContext extends FieldContext {
    constructor(corners: Point[]){
        super(corners);
        this.setFillColor({
            color: 'black',
            alpha: 0.4,
        });
    }
}