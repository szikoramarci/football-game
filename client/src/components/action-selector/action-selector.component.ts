import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
@Component({
    selector: 'action-selector',
    standalone: true,
    templateUrl: './action-selector.component.html',
    styleUrl: './action-selector.component.scss'
})
export class ActionSelectorComponent implements OnInit {

    actionLabel!: string | null;    

   /* actionMenuItems: ActionStepMenuItem[] = [
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
    ]*/

    constructor(private store: Store) {}
 
    ngOnInit(): void {
    /*    this.store.select(getLastStepMeta())
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
        })*/
    }

}