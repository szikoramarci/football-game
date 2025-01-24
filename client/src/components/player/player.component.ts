import { Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";
import { Container } from "pixi.js";
import { Player } from "../../models/player.model";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { GridService } from "../../services/grid/grid.service";
import { HexCoordinates } from "@szikoramarci/honeycomb-grid";
import { getPlayerPosition } from "../../stores/player-position/player-position.selector";
import { AnimateService } from "../../services/animate/animate.service";
import { TacklingHelperService } from "../../services/action-helper/tackling-helper.service";
import { PlayerTokenComponent } from "../player-token/player-token.component";

@Component({
    selector: 'player',
    standalone: true,
    imports: [PlayerTokenComponent],
    templateUrl: './player.component.html',
})
export class PlayerComponent implements OnDestroy {
    
    @Input() player!: Player;

    @Output() onGraphicsChanged = new EventEmitter<Container>()
    
    tokenGraphics!: Container  

    playerMovementSubscription!: Subscription;
    tackleTryingEventSubscription!: Subscription;

    constructor(
        private store: Store,
        private grid: GridService,
        private animate: AnimateService,
        private tacklingHelper: TacklingHelperService
    ) {}

    initPlayerPositionSubscription() {        
        this.playerMovementSubscription = this.store.select(getPlayerPosition(this.player.id))
            .subscribe(position => {                
                this.movePlayer(position);
            })        
    }

    async movePlayer(newCoordinates: HexCoordinates) {
        const hex = this.grid.getHex(newCoordinates);                
        if (hex) {            
            this.animate.move(this.tokenGraphics, hex)
        }        
    }

    initTackleTryingSubscription() {
        this.tackleTryingEventSubscription = this.tacklingHelper.getTackleTryingEvents(this.player.id)
            .subscribe(coordinates => {
                this.tacklePlayer(coordinates)
            })
    }
    
    async tacklePlayer(newCoordinates: HexCoordinates) {
        const hex = this.grid.getHex(newCoordinates);                
        if (hex) {            
            this.animate.bounce(this.tokenGraphics, hex)
        }
    }   

    handleGraphics(graphics: Container){
        this.tokenGraphics = graphics
        this.onGraphicsChanged.emit(this.tokenGraphics)
        this.initPlayerPositionSubscription();   
        this.initTackleTryingSubscription(); 
    }

    ngOnDestroy(): void {
        this.tokenGraphics.destroy();
        this.playerMovementSubscription?.unsubscribe();
        this.tackleTryingEventSubscription?.unsubscribe()
    }
}
