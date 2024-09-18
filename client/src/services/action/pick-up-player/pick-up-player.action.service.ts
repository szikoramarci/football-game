import { Injectable } from "@angular/core";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { IsOwnPlayer } from "../../../actions/rules/pick-up-player/is-own-player.rule";
import { Store } from "@ngrx/store";
import { triggerAction } from "../../../stores/action/action.actions";
import { PickUpPlayerActionMeta } from "../../../actions/metas/pick-up-player.action.meta";
import { SetMovingPathAction } from "../set-moving-path/set-moving-path.action.service";

@Injectable({
  providedIn: 'root',
})
export class PickUpPlayerAction implements ActionStrategy {
    ruleSet: ActionRuleSet;
  
    constructor(private store: Store) {
      this.ruleSet = new ActionRuleSet();
      this.ruleSet.addRule(new IsOwnPlayer());
    }
  
    identify(context: ActionContext): boolean {
      return this.ruleSet.validate(context);
    }
  
    calculation(context: ActionContext): void {
      console.log("Kalkulációk végrehajtása");
    }
  
    triggerVisual(context: ActionContext): void {
      console.log("Vizuális réteg frissítése: útvonal megjelenítése.");
    }
  
    updateState(context: ActionContext): void {
      const pickUpPlayerActionMeta: PickUpPlayerActionMeta = {
        timestamp: new Date(),
        availableNextActions: [SetMovingPathAction],
        movableHexes: []
      }
      this.store.dispatch(triggerAction(pickUpPlayerActionMeta));
    }
  }