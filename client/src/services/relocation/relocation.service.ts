import { Injectable, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import { RelocationTurn } from "../../relocation/relocation-turn.interface";
import { Subscription } from "rxjs";
import { getRelocationState } from "../../stores/relocation/relocation.selector";
import { getAttackingTeam } from "../../stores/gameplay/gameplay.selector";
import { Player } from "../../models/player.model";

@Injectable({
    providedIn: 'root'
})
export class RelocationService implements OnDestroy {

    attackingTeam!: string    

    relocationTurns: RelocationTurn[] = []
    usedPlayers: Set<string> = new Set()

    attackingTeamSubscription!: Subscription    
    currentScenarioSubscription!: Subscription

    constructor(
        private store: Store
    ){
        this.initSubscriptions()
    }

    initSubscriptions() {
        this.attackingTeamSubscription = this.store.select(getAttackingTeam()).subscribe(attackingTeam => {
            this.attackingTeam = attackingTeam
        })        
        this.currentScenarioSubscription = this.store.select(getRelocationState).subscribe(currentScenario => {
            this.relocationTurns = currentScenario.relocationTurns
            this.usedPlayers = currentScenario.usedPlayers
        })
    }

    isRelocationScenarioActive(): boolean {
        return this.relocationTurns.length > 0
    }

    getNextRelocationTurn(): RelocationTurn {
        return this.relocationTurns[0]
    }
    
    isPlayerMovable(player: Player): boolean {
        if (player == undefined) return false

        if (this.relocationTurns.length == 0) {
            return player.team == this.attackingTeam
        } 

        if (this.usedPlayers.has(player.id)) return false 

        const currentRelocationTurn = this.relocationTurns[0]
        if (currentRelocationTurn.team != player.team) return false

        return true
    }    
    
    ngOnDestroy(): void {
        this.attackingTeamSubscription.unsubscribe()
        this.currentScenarioSubscription.unsubscribe()
    }
}