
class GrabManager { 
    grabbedElement = null;

    constructor(){
        if (!GrabManager.instance) {            

            GrabManager.instance = this;
        }

        return GrabManager.instance;
    }

    grabElement(element){
        if (this.isGrabbed()) return;

        element.getGraphics().eventMode = 'none';
        this.grabbedElement = element;
    }

    looseElement(){
        this.grabbedElement.getGraphics().eventMode = 'static';
        this.grabbedElement = null;
    }

    isGrabbed(){
        return this.grabbedElement != null;
    }

    isAlreadyGrabbed(element){
        return this.grabbedElement == element;
    }

    getGrabbedElement(){
        return this.grabbedElement;
    }
    
}

export default new GrabManager();