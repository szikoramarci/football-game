import { Injectable } from "@angular/core";
import LightFieldContext from "../../contexts/LightFieldContext.class";
import DarkFieldContext from "../../contexts/DarkFieldContext.class";
import StatusBaseFieldContext from "../../contexts/StatusBaseFieldContext.class";
import StatusHoveredFieldContext from "../../contexts/StatusHoveredFieldContext.class";
import { Point } from "honeycomb-grid";

@Injectable({
    providedIn: 'root'
})
export class ContextService {
    lightFieldContext!: LightFieldContext;
    darkFieldContext!: DarkFieldContext;
    statusBaseFieldContext!: StatusBaseFieldContext;
    statusHoveredFieldContext!: StatusHoveredFieldContext;

    setUpContexts(corners: Point[]){
        this.lightFieldContext = new LightFieldContext(corners);
        this.darkFieldContext = new DarkFieldContext(corners);
        this.statusBaseFieldContext = new StatusBaseFieldContext(corners);
        this.statusHoveredFieldContext = new StatusHoveredFieldContext(corners);
    }

    getLightFieldContext(){
        if (!this.lightFieldContext) {
            throw new Error('LightFieldContext is not set up. Call setUpContexts() first.');
        }
        return this.lightFieldContext.getContext();
    }

    getDarkFieldContext() {
        if (!this.darkFieldContext) {
            throw new Error('DarkFieldContext is not set up. Call setUpContexts() first.');
        }
        return this.darkFieldContext.getContext();
    }

    getStatusHoveredFieldContext() {
        if (!this.statusHoveredFieldContext) {
            throw new Error('StatusHoveredFieldContext is not set up. Call setUpContexts() first.');
        }
        return this.statusHoveredFieldContext.getContext();
    }

    getStatusBaseFieldContext() {
        if (!this.statusBaseFieldContext) {
            throw new Error('StatusBaseFieldContext is not set up. Call setUpContexts() first.');
        }
        return this.statusBaseFieldContext.getContext();
    }
}
