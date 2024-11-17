import { Component, OnInit } from "@angular/core";
import { ActionStepMenuItem } from "../../action-steps/interfaces/action-step-menu-item.interface";
import { Store } from "@ngrx/store";
import { filter, tap } from "rxjs";
import { getLastActionMeta } from "../../stores/action/action.selector";
import { InitMovingActionStep } from "../../services/action-step/init-moving/init-moving.action.service";
import { SetMovingPathActionStep } from "../../services/action-step/set-moving-path/set-moving-path.action.service";
import { InitStandardPassingActionStep } from "../../services/action-step/init-standard-passing/init-standard-passing.action.service";
import { InitHighPassingActionStep } from "../../services/action-step/init-high-passing/init-high-passing.action.service";

@Component({
    selector: 'action-selector',
    standalone: true,
    templateUrl: './action-selector.component.html',
    styleUrl: './action-selector.component.scss'
})
export class ActionSelectorComponent implements OnInit {

    actionLabel!: string | null;    

    actionMenuItems: ActionStepMenuItem[] = [
        {
            label: 'Move',
            relatedActions: [InitMovingActionStep, SetMovingPathActionStep],
        },
        {
            label: 'Standard Pass',
            relatedActions: [InitStandardPassingActionStep],
        },
        {
            label: 'High Pass',
            relatedActions: [InitHighPassingActionStep],
        }
    ]

    constructor(private store: Store) {}
 
    ngOnInit(): void {
        this.store.select(getLastActionMeta())
        .pipe(
            tap(() => {
                this.actionLabel = null;
            }),
            filter(actionMeta => !!actionMeta),
        )
        .subscribe(lastActionMeta => {  
            const actionMenuItem = this.actionMenuItems.find(item => item.relatedActions.includes(lastActionMeta.actionType))
            if (actionMenuItem) {
                this.actionLabel = actionMenuItem.label;
            }
        })
    }

}