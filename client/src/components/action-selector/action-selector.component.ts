import { Component, OnInit, output, Output, Type } from "@angular/core";
import { ActionMenuItem } from "../../actions/interfaces/action.menu.item.interface";
import { Store } from "@ngrx/store";
import { getLastActionMeta } from "../../stores/action/action.selector";
import { filter, tap } from "rxjs";
import { InitPassingAction } from "../../services/action/init-passing/init-passing.action.service";
import { InitMovingAction } from "../../services/action/init-moving/init-moving.action.service";
import { ActionStrategy } from "../../actions/interfaces/action.strategy.interface";
import { EventEmitter } from "pixi.js";
import { setActionMode } from "../../stores/action/action.actions";

@Component({
    selector: 'action-selector',
    standalone: true,
    templateUrl: './action-selector.component.html',
    styleUrl: './action-selector.component.scss'
})
export class ActionSelectorComponent implements OnInit {

    actionMenuItems: ActionMenuItem[] = [
        {
            label: 'Move',
            relatedAction: InitMovingAction,
        },
        {
            label: 'Pass',
            relatedAction: InitPassingAction,
        }
    ]

    constructor(private store: Store) {}
 
    ngOnInit(): void {
        this.store.select(getLastActionMeta())
        .pipe(
            tap(() => {
                this.disableAllItems();
            }),
            filter(actionMeta => !!actionMeta),
        )
        .subscribe(lastActionMeta => {  
            lastActionMeta.availableNextActions.forEach(action => {
                const item = this.actionMenuItems.find(item => item.relatedAction == action);
                if (item) {
                    item.available = true;
                }
            })
        })
    }

    disableAllItems() {
        this.actionMenuItems.forEach(item => item.available = false);
    }

    triggerAction(action: Type<ActionStrategy>) {
        this.store.dispatch(setActionMode({ mode: action }));
    }
}