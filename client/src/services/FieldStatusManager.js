import { Subject } from "rxjs";

class FieldStatusManager { 
    fieldStatus = new Subject();
    fieldStatusList = [];

    constructor(){
        if (!FieldStatusManager.instance) {            

            FieldStatusManager.instance = this;
        }

        return FieldStatusManager.instance;
    }

    getFieldStatus() {
        return this.fieldStatus;
    }

    clear() {
        this.fieldStatusList = [];
    }

    addFieldStatus(col, row, status) {
        this.fieldStatusList.push({
            col: col,
            row: row,
            status: status
        })
    }

    broadcast() {
        this.fieldStatus.next(this.fieldStatusList);
        this.clear();
    } 
  
}

export default new FieldStatusManager();