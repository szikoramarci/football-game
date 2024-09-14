import DarkFieldContext from "../contexts/field/DarkFieldContext";
import StatusBaseFieldContext from "@/contexts/field/StatusBaseFieldContext";
import StatusHoveredFieldContext from "@/contexts/field/StatusHoveredFieldContext";
import LightFieldContext from "../contexts/field/LightFieldContext";

class FieldContextManager {
    lightFieldContext = null;
    darkFieldContext = null;
    statusHoveredFieldContext = null;
    statusBaseFieldContext = null;

    constructor() {
        if (!FieldContextManager.instance) {
            FieldContextManager.instance = this;
        }

        return FieldContextManager.instance;
    }

    setUpContexts(corners){
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

export default new FieldContextManager();