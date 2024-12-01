import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { getAvailableActions, getCurrentAction } from "../../stores/action/action.selector";
import { Action } from "../../actions/action.interface";
import { filter } from "rxjs";
import { clearStepMeta, setCurrentAction } from "../../stores/action/action.actions";
@Component({
    selector: 'action-selector',
    standalone: true,
    templateUrl: './action-selector.component.html',
    styleUrl: './action-selector.component.scss'
})
export class ActionSelectorComponent implements OnInit {

    availableActions: Action[] = []
    currentAction!: Action

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

    changeCurrentAction(action: Action) {
        if (action.name === this.currentAction.name) return

        this.store.dispatch(clearStepMeta())
        this.store.dispatch(setCurrentAction({ action: action }))
    }

}