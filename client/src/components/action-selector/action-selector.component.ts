import { Component, OnInit, Type } from "@angular/core";
import { Store } from "@ngrx/store";
import { getCurrentAction, getSelectableActions } from "../../stores/action/action.selector";
import { filter, Observable } from "rxjs";
import { clearActionMeta, setCurrentAction } from "../../stores/action/action.actions";
import { Action } from "../../actions/classes/action.class";
import { AsyncPipe } from "@angular/common";
@Component({
    selector: 'action-selector',
    standalone: true,
    imports: [AsyncPipe],
    templateUrl: './action-selector.component.html',
    styleUrl: './action-selector.component.scss'
})
export class ActionSelectorComponent implements OnInit {

    selectableActions$!: Observable<Type<Action>[]>
    currentAction!: Type<Action>

    constructor(private store: Store) {}
 
    ngOnInit(): void {
        this.selectableActions$ = this.store.select(getSelectableActions())

        this.store.select(getCurrentAction())
        .pipe(filter(action => !!action))
        .subscribe(currentAction => {  
            this.currentAction = currentAction
        })
    }

    changeCurrentAction(action: Type<Action>) {
        if (action === this.currentAction) return

        this.store.dispatch(clearActionMeta())
        this.store.dispatch(setCurrentAction({ action }))
    }

    getActionName(action: Type<Action>) {
        const actionInstance = new action()
        return actionInstance.getName()
    }

}