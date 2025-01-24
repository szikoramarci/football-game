import { Injectable, OnDestroy } from "@angular/core";
import { PlayerWithPosition } from "../../interfaces/player-with-position.interface";
import { filter, map, Observable, Subject, Subscription } from "rxjs";
import { PlayerService } from "../player/player.service";
import { Store } from "@ngrx/store";
import { getBallPosition } from "../../stores/ball-position/ball-position.selector";
import { equals, Grid, Hex, OffsetCoordinates } from "@szikoramarci/honeycomb-grid";
import { Player } from "../../models/player.model";
import { GridService } from "../grid/grid.service";
import { MovingHelperService } from "./moving-helper.service";
import { TraverserService } from "../traverser/traverser.service";
import { RelocationService } from "../relocation/relocation.service";

@Injectable({
    providedIn: 'root',
})
export class TacklingHelperService implements OnDestroy {

    attackingPlayersWithPosition!: PlayerWithPosition[]
    defendingPlayersWithPosition!: PlayerWithPosition[]
    ballPosition!: OffsetCoordinates

    attackingPlayersSubscription!: Subscription
    defendingPlayersSubscription!: Subscription
    ballPositionSubscription!: Subscription

    tacklingTrying: Subject<{playerID: string, coordinates: OffsetCoordinates}> = new Subject()

    constructor(
        private player: PlayerService,
        private store: Store,
        private movingHelper: MovingHelperService,
        private grid: GridService,
        private traverser: TraverserService,
        private relocation: RelocationService
    ) {
        this.initSubscriptions()
    }

    initSubscriptions() {
        this.attackingPlayersSubscription = this.player.getAttackingPlayersWithPositions().subscribe(attackingPlayersWithPosition => {
            this.attackingPlayersWithPosition = attackingPlayersWithPosition
        })
        this.defendingPlayersSubscription = this.player.getDefendingPlayersWithPositions().subscribe(defendingPlayersWithPosition => {
            this.defendingPlayersWithPosition = defendingPlayersWithPosition
        })
        this.ballPositionSubscription = this.store.select(getBallPosition()).subscribe(ballPosition => {
            this.ballPosition = ballPosition
        })
    }

    canPlayerTackle(player: Player): boolean {     
        if (player === undefined) return false

        const playerIsMovable = this.relocation.isPlayerMovable(player)
        if (playerIsMovable === false) return false

        const playerWithPosition = this.defendingPlayersWithPosition.find(playerWithPosition => player.id == playerWithPosition.player.id)    
        if (playerWithPosition == undefined) return false        
  
        const playerWithBall = this.attackingPlayersWithPosition.find(playerWithPosition => equals(playerWithPosition.position, this.ballPosition))              
        if (playerWithBall == undefined) return false

        const ballerIsOppositeTeam = !!playerWithBall && playerWithBall?.player.team !== player.team
        if (!ballerIsOppositeTeam) return false

        return this.generatePossibleTacklingHexes(playerWithPosition).toArray().length > 0
    }

    generatePossibleTacklingHexes(playerWithPosition: PlayerWithPosition): Grid<Hex> {
        const distance = playerWithPosition.player?.speed || 0;  
        const positionHex = this.grid.getHex(playerWithPosition.position)
        const reachableHexes = this.movingHelper.generateReachableHexes(positionHex!, distance, null).toArray()

        const possibleTacklingHexes = this.grid.createGrid()

        this.traverser.getNeighbors(this.ballPosition).forEach(neighborHex => {
            if (reachableHexes.some(reachableHex => equals(neighborHex, reachableHex))) {
                possibleTacklingHexes.setHexes([neighborHex])
            }
        })

        return possibleTacklingHexes
    }

    triggerTackleTrying(playerID: string, coordinates: OffsetCoordinates) {
        this.tacklingTrying.next({ playerID, coordinates })
    }

    getTackleTryingEvents(playerID: string): Observable<OffsetCoordinates> {
        return this.tacklingTrying.pipe(
            filter(tackleTrying => tackleTrying.playerID == playerID),  
            map(tacklingTrying => tacklingTrying.coordinates)
        )
    }
    
    ngOnDestroy(): void {
        this.attackingPlayersSubscription.unsubscribe()
        this.defendingPlayersSubscription.unsubscribe()
        this.ballPositionSubscription.unsubscribe()
    }

}