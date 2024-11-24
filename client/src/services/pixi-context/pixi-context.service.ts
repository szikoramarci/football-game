import { Injectable } from "@angular/core";
import LightFieldContext from "../../contexts/LightFieldContext.class";
import DarkFieldContext from "../../contexts/DarkFieldContext.class";
import { Point } from "honeycomb-grid";
import MovementIndicatorContext from "../../contexts/MovementIndicatorContext.cass";
import PassingIndicatorContext from "../../contexts/PassingIndicatorContext.class";
import ChallengeIndicatorContext from "../../contexts/ChallengeIndicatorContext.class copy";

@Injectable({
    providedIn: 'root'
})
export class PIXIContextService {
    lightFieldContext!: LightFieldContext;
    darkFieldContext!: DarkFieldContext;

    movementIndicatorContext!: MovementIndicatorContext;
    passingIndicatorContext!: PassingIndicatorContext;
    challengeIndicatorContext!: ChallengeIndicatorContext;

    setUpContexts(corners: Point[]){
        this.lightFieldContext = new LightFieldContext(corners);
        this.darkFieldContext = new DarkFieldContext(corners);
        
        this.movementIndicatorContext = new MovementIndicatorContext(corners);
        this.passingIndicatorContext = new PassingIndicatorContext(corners);
        this.challengeIndicatorContext = new ChallengeIndicatorContext(corners);
    }

    getLightFieldContext() {
        return this.lightFieldContext.getContext();
    }

    getDarkFieldContext() {
        return this.darkFieldContext.getContext();
    }

    getMovementIndicatorContext() {
        return this.movementIndicatorContext.getContext();
    }

    getPassingIndicatorContext() {
        return this.passingIndicatorContext.getContext();
    }

    getChallengeIndicatorContext() {
        return this.challengeIndicatorContext.getContext();
    }

}
