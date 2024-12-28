import { Injectable } from "@angular/core";
import { TacklingActionMeta } from "../../../actions/metas/tackling.action-meta";
import { Step } from "../../../actions/classes/step.class";
import { IsLeftClick } from "../../../actions/rules/is-left-click.rule";
import { IsTheNextStep } from "../../../actions/rules/is-the-next-step.rule";
import { Store } from "@ngrx/store";
import { IsPossibleTacklingHexClicked } from "../../../actions/rules/tackle/is-possible-tackling-hex-clicked.rule";
import { concatMap, delay, from, map, of } from "rxjs";
import { movePlayer } from "../../../stores/player-position/player-position.actions";
import { Hex } from "honeycomb-grid";
import { TacklingHelperService } from "../../action-helper/tackling-helper.service";

const playerStepDelay: number = 300

@Injectable({
  providedIn: 'root',
})
export class TackleStep extends Step {
    actionMeta!: TacklingActionMeta;

    constructor(
        private store: Store,
        private tackleHelper: TacklingHelperService
    ) {
        super()
        this.initRuleSet()
    }

    initRuleSet() {
        this.addRule(new IsLeftClick())
        this.addRule(new IsTheNextStep(TackleStep))
        this.addRule(new IsPossibleTacklingHexClicked())
    }

    calculation(): void {
        this.actionMeta = {...this.context.actionMeta as TacklingActionMeta}
    }

    movePlayer(coordinates: Hex) {
        this.store.dispatch(movePlayer({
            playerID: this.actionMeta.player.id!, 
            position: coordinates
        }));  
    }

    tacklePlayer(coordinates: Hex) {
        this.tackleHelper.triggerTackleTrying(
            this.actionMeta.player.id!,
            coordinates
        )
    }

    updateState(): void {
        const movingPath = this.actionMeta.movingPath!.toArray()

        from(movingPath)
            .pipe(                
                concatMap((position, index) => 
                    index === 0 
                        ? of(position)  // No delay for the first action
                        : of(position).pipe(delay(playerStepDelay)) // Delay for the rest
                ),          
                map((position, index) => {
                    return {
                        position,
                        index
                    }
                })
            )
            .subscribe(({position, index}) => {
                if (index === movingPath.length - 1) {
                    this.tacklePlayer(position); // Handle the last hex differently
                } else {
                    this.movePlayer(position);
                }
            });
    }
}