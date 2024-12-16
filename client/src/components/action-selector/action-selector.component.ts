import { Component, OnInit, Type } from "@angular/core";
import { Store } from "@ngrx/store";
import { getAvailableActions, getCurrentAction } from "../../stores/action/action.selector";
import { filter } from "rxjs";
import { clearStepMeta, setCurrentAction } from "../../stores/action/action.actions";
import { Action } from "../../actions/classes/action.class";
@Component({
    selector: 'action-selector',
    standalone: true,
    templateUrl: './action-selector.component.html',
    styleUrl: './action-selector.component.scss'
})
export class ActionSelectorComponent implements OnInit {

    availableActions: Type<Action>[] = []
    currentAction!: Type<Action>

    constructor(private store: Store) {}
 
    ngOnInit(): void {
        this.store.select(getAvailableActions())
        .subscribe(availableActions => {  
            this.availableActions = availableActions
        })

        this.store.select(getCurrentAction())
        .pipe(filter(action => !!action))
        .subscribe(currentAction => {  
            this.currentAction = currentAction
        })
    }

    changeCurrentAction(action: Type<Action>) {
        if (action.name === this.currentAction.name) return

        this.store.dispatch(clearStepMeta())
        this.store.dispatch(setCurrentAction({ action: action }))
    }

}