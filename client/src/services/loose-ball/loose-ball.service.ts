import { Injectable, OnDestroy } from "@angular/core";
import { ChallengeService } from "../challenge/challenge.service";
import { Direction, equals, Hex, hexToOffset, OffsetCoordinates } from "honeycomb-grid";
import { TraverserService } from "../traverser/traverser.service";
import { concatMap, delay, from, last, of, skip, Subscription, takeWhile, tap } from "rxjs";
import { PlayerWithPosition } from "../../interfaces/player-with-position.interface";
import { PlayerService } from "../player/player.service";
import { Store } from "@ngrx/store";
import { getAttackingTeam } from "../../stores/gameplay/gameplay.selector";
import { moveBall } from "../../stores/ball-position/ball-position.actions";
import { Player } from "../../models/player.model";
import { RelocationService } from "../relocation/relocation.service";
import { clearScenario } from "../../stores/relocation/relocation.actions";

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
        private relocation: RelocationService,
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

        console.log('LOOSING BALL')

        // TODO -> HIGH PASS és LONG BALL -> a végső landolási pont változik meg, ezt kezelni kell
        // VONALAK KEZELÉSE (alapvonal, oldalvonal, gólvonal)
        // GÓL kezelése -> kapus próbálkozhat védéssel 5-6-os dobás, vagy saving 10+

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
                    console.log('ATTACKING')
                    // 1. IF MP is active -> continue
                    // 2. ELSE IF MP is not active -> new MP or SNAPSHOT (lehet, hogy ez any other scenario?)
                    if (!this.relocation.isRelocationScenarioActive()) {
                       // NEW MP or SNAPSHOT
                    }   
                } else {                    
                    console.log('DEFENDING')
                    // 1. HITS DEFENDER -> stops MP -> Any other scenario   
                    if (this.relocation.isRelocationScenarioActive()) {
                        this.store.dispatch(clearScenario())
                    }                 
                }                                    
            } else {                
                console.log('FREE')
                // 1. NEXT TO A DEFENDER -> DEFERENDER ROLLS 6 -> GET THE BALL -> ANY OTHER SCENARIO
                // 2. ELSE IF MP is active -> continue
                // 3. ELSE IF MP is not active -> MOVEMENT PHASE with ATTACKER (igazából magától fog menni, mert labda nélkül csak azt lehet választani)           }            
                // +1 ha a labda szabad és védő megy majd rá, akkor ott le kell állítani az MP-t, és ANY OTHER SCENARIO -> ezt majd a move-ba kell betenni
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