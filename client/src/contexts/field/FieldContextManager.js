import DarkFieldContext from "./DarkFieldContext";
import HoveredFieldContext from "./HoveredFieldContext";
import LightFieldContext from "./LightFieldContext";

class FieldContextManager {
    lightFieldContext = null;
    darkFieldContext = null;
    hoveredFieldContext = null;

    constructor() {
        if (!FieldContextManager.instance) {
            FieldContextManager.instance = this;
        }

        return FieldContextManager.instance;
    }

    setUpContexts(corners){
        this.lightFieldContext = new LightFieldContext(corners);
        this.darkFieldContext = new DarkFieldContext(corners);
        this.hoveredFieldContext = new HoveredFieldContext(corners);
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

    getHoveredFieldContext() {
        if (!this.hoveredFieldContext) {
            throw new Error('HoveredFieldContext is not set up. Call setUpContexts() first.');
        }
        return this.hoveredFieldContext.getContext();
    }

}


export default new FieldContextManager();