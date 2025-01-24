import FieldContext from "./FieldContext.class";
import { Point } from "@szikoramarci/honeycomb-grid";

export default class ChallengeIndicatorContext extends FieldContext {
    constructor(corners: Point[]){
        super(corners);
        this.setFillColor({
            color: 'red',
            alpha: 0.4,
        });
    }
}