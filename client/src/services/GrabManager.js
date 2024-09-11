
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
        this.grabbedElement = element;
    }

    looseElement(){
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