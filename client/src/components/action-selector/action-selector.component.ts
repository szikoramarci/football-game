import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { filter, tap } from "rxjs";
import { getLastStepMeta } from "../../stores/action/action.selector";
import { InitMovingStep } from "../../services/action-step/init-moving/init-moving.step.service";
import { SetMovingPathStep } from "../../services/action-step/set-moving-path/set-moving-path.step.service";
import { InitStandardPassingStep } from "../../services/action-step/init-standard-passing/init-standard-passing.step.service";
import { InitHighPassingStep } from "../../services/action-step/init-high-passing/init-high-passing.step.service";

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
            relatedActions: [InitMovingStep, SetMovingPathStep],
        },
        {
            label: 'Standard Pass',
            relatedActions: [InitStandardPassingStep],
        },
        {
            label: 'High Pass',
            relatedActions: [InitHighPassingStep],
        }
    ]

    constructor(private store: Store) {}
 
    ngOnInit(): void {
        this.store.select(getLastStepMeta())
        .pipe(
            tap(() => {
                this.actionLabel = null;
            }),
            filter(actionMeta => !!actionMeta),
        )
        .subscribe(lastActionMeta => {  
            const actionMenuItem = this.actionMenuItems.find(item => item.relatedActions.includes(lastActionMeta.stepType))
            if (actionMenuItem) {
                this.actionLabel = actionMenuItem.label;
            }
        })
    }

}