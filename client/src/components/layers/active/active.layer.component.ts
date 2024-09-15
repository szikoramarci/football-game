import { Component, OnInit } from "@angular/core";
import { ClickService } from "../../../services/click/click.service";
import { Store } from "@ngrx/store";
import { getPlayerByPosition } from "../../../stores/player-position/player-position.selector";
import { take } from "rxjs";

@Component({
    selector: 'active-layer',
    standalone: true,
    imports: [],
    templateUrl: './active.layer.component.html',
})
export class ActiveLayerComponent implements OnInit {

    constructor(
        private click: ClickService,
        private store: Store
    ) {}

    ngOnInit(): void {
        this.click.clickEvents.
        subscribe((event) => {            
            if (event.coordinates !== undefined) {
                this.store.select(getPlayerByPosition(event.coordinates)).pipe(
                    take(1)  
                ).subscribe(playerID => {
                    console.log(playerID)
                });
            }
        })    
    }
}