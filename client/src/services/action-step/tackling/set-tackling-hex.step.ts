import { Injectable } from "@angular/core";
import { Step } from "../../../actions/classes/step.class";
import { Store } from "@ngrx/store";
import { saveActionMeta } from "../../../stores/action/action.actions";
import { TacklingActionMeta } from "../../../actions/metas/tackling.action-meta";
import { IsMouseOver } from "../../../actions/rules/is-mouse-over.rule";
import { IsTheNextStep } from "../../../actions/rules/is-the-next-step.rule";
import { getPlayerPositions } from "../../../stores/player-position/player-position.selector";
import { take } from "rxjs";
import { equals, OffsetCoordinates } from "honeycomb-grid";
import { GridService } from "../../grid/grid.service";
import { TraverserService } from "../../traverser/traverser.service";
import { TackleStep } from "./tackle.step";

@Injectable({
  providedIn: 'root',
})
export class SetTacklingHexStep extends Step {
    actionMeta!: TacklingActionMeta;

    constructor(
        private store: Store,
        private grid: GridService,
        private traverser: TraverserService
    ) {
        super()
        this.initRuleSet()
    }
    

    initRuleSet() {
        this.addRule(new IsMouseOver())
        this.addRule(new IsTheNextStep(SetTacklingHexStep))
    }    

    calculation(): void {
        this.actionMeta = {...this.context.actionMeta as TacklingActionMeta}

        if (this.isHexClickable()) {
            this.generateMovingPath()
        } else{
            this.resetMovingPath()
        }
        
        this.generateAvailableNextSteps()
    }

    isHexClickable(){
        return this.actionMeta.possibleTacklingHexes.hasHex(this.context.hex)
    }

    generateMovingPath(){
        const startPoint: OffsetCoordinates = this.actionMeta.playerHex;
        const endPoint: OffsetCoordinates = this.context.hex;  

        if (equals(startPoint,endPoint)) {
            this.actionMeta.movingPath = this.grid.createGrid().setHexes([startPoint, this.actionMeta.ballHex])
        } else {
            this.store.select(getPlayerPositions).pipe(take(1))
            .subscribe((occupiedCoordinates) => {
                const offsetCoordinates: OffsetCoordinates[] = Object.values(occupiedCoordinates)      
                const occupiedHexes = this.grid.createGrid()
                    .setHexes(offsetCoordinates)
                    .setHexes(this.grid.getFrame())
            
                this.actionMeta.movingPath = this.traverser.getPathHexes(startPoint!, endPoint!, occupiedHexes).setHexes([this.actionMeta.ballHex!])                     
            })
        }        
    }

    resetMovingPath() {
        this.actionMeta.movingPath = undefined
    }

    generateAvailableNextSteps() {        
        this.actionMeta.availableNextSteps = [SetTacklingHexStep, TackleStep];
    }

    updateState(): void {
        this.store.dispatch(saveActionMeta(this.actionMeta));  
    }
}