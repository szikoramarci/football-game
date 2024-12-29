import { Injectable, OnDestroy } from "@angular/core";
import { ChallengeService } from "../challenge/challenge.service";
import { Direction, equals, Hex, hexToOffset, OffsetCoordinates } from "honeycomb-grid";
import { TraverserService } from "../traverser/traverser.service";
import { concatMap, concatMapTo, delay, from, last, of, partition, skip, Subscription, takeWhile, tap, toArray } from "rxjs";
import { PlayerWithPosition } from "../../interfaces/player-with-position.interface";
import { PlayerService } from "../player/player.service";
import { Store } from "@ngrx/store";
import { getAttackingTeam } from "../../stores/gameplay/gameplay.selector";
import { moveBall } from "../../stores/ball-position/ball-position.actions";
import { Player } from "../../models/player.model";

@Injectable({
    providedIn: 'root'
})
export class LooseBallService implements OnDestroy {

    attackingTeam!: string
    playersWithPosition!: PlayerWithPosition[]

    attackingTeamSubscription!: Subscription  
    playersWithPositionSubscription!: Subscription

    constructor(
        private challange: ChallengeService,
        private traverser: TraverserService,
        private player: PlayerService,
        private store: Store
    ) {
        this.initSubscriptions()
    }
    
    initSubscriptions() {
        this.attackingTeamSubscription = this.store.select(getAttackingTeam()).subscribe(attackingTeam => {
            this.attackingTeam = attackingTeam
        })        
        this.playersWithPositionSubscription = this.player.getPlayersWithPositions().subscribe(playersWithPosition => {
            this.playersWithPosition = playersWithPosition
        })
    }

    generateDirection(): Direction {
        const direction = this.challange.rollDice()
        switch(direction) {
            case 1: return Direction.N
            case 2: return Direction.NE
            case 3: return Direction.SE
            case 4: return Direction.S
            case 5: return Direction.SW
            case 6: return Direction.NW
        }
        
        return Direction.N
    }

    generateDistance(): number {
        return this.challange.rollDice() + 1
    }

    loosingBall(position: OffsetCoordinates) {
        const direction: Direction = this.generateDirection()
        const distance: number = this.generateDistance()

        const directLineGrid = this.traverser.getDirectLine(position, direction, distance)

        from(directLineGrid.toArray()).pipe(
            skip(1),
            concatMap(position => of(position).pipe(delay(150))),
            tap(hex => this.moveBall(hex)),
            takeWhile(position => !this.playerHitHappening(position), true),
            last()
        ).subscribe(lastHex => {
            if (this.playerHitHappening(lastHex)) {
                const player = this.getPlayerOnHex(lastHex)
                if (player && player.team == this.attackingTeam) {
                    // 2. HITS ATTACKER -> if MP -> then continue -> else start ne MP or SNAPSHOT
                    console.log('ATTACKING')
                } else {
                    // 3. HITS DEFENDER -> stops MP -> Any other scenario
                    console.log('DEFENDING')
                }                                    
            } else {
                // 1. NOT HIT -> if MP -> then continue -> else start a new MP
                console.log('FREE')
            }            
        })
            
    }

    moveBall(hex: Hex) {
        this.store.dispatch(moveBall(hexToOffset(hex)))   
    }

    playerHitHappening(hex: Hex): boolean {
        return !!this.getPlayerOnHex(hex)
    }

    getPlayerOnHex(hex: Hex): Player | null {
        const playerWithPosition: PlayerWithPosition = this.playersWithPosition.find(playersWithPosition => equals(playersWithPosition.position, hex))!
        if (playerWithPosition) {
            return playerWithPosition.player
        }

        return null
    }

    ngOnDestroy(): void {
        this.attackingTeamSubscription.unsubscribe()
        this.playersWithPositionSubscription.unsubscribe()
    }
}