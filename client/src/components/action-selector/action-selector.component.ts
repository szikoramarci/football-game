import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { getAvailableActions } from "../../stores/action/action.selector";
import { Action } from "../../actions/action.interface";
@Component({
    selector: 'action-selector',
    standalone: true,
    templateUrl: './action-selector.component.html',
    styleUrl: './action-selector.component.scss'
})
export class ActionSelectorComponent implements OnInit {

    availableActions: Action[] = []

    constructor(private store: Store) {}
 
    ngOnInit(): void {
        this.store.select(getAvailableActions())
        .subscribe(availableActions => {  
            this.availableActions = availableActions
        })
    }

}