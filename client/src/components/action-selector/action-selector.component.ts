import { Component, OnInit } from "@angular/core";
import { ActionMenuItem } from "../../actions/interfaces/action.menu.item.interface";
import { Store } from "@ngrx/store";
import { filter, tap } from "rxjs";
import { getLastActionMeta } from "../../stores/action/action.selector";
import { InitMovingActionMeta } from "../../actions/metas/init-moving.action.meta";
import { InitMovingAction } from "../../services/action/init-moving/init-moving.action.service";
import { SetMovingPathAction } from "../../services/action/set-moving-path/set-moving-path.action.service";
import { InitPassingAction } from "../../services/action/init-passing/init-passing.action.service";

@Component({
    selector: 'action-selector',
    standalone: true,
    templateUrl: './action-selector.component.html',
    styleUrl: './action-selector.component.scss'
})
export class ActionSelectorComponent implements OnInit {

    actionLabel!: string | null;    

    actionMenuItems: ActionMenuItem[] = [
        {
            label: 'Move',
            relatedActions: [InitMovingAction, SetMovingPathAction],
        },
        {
            label: 'Pass',
            relatedActions: [InitPassingAction],
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