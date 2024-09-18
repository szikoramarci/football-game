import { Injectable } from "@angular/core";
import { ActionContext } from "../../../actions/interfaces/action.context.interface";
import { ActionStrategy } from "../../../actions/interfaces/action.strategy.interface";
import { ActionRuleSet } from "../../../actions/interfaces/action.rule.interface";
import { IsOwnPlayer } from "../../../actions/rules/pick-up-player/is-own-player.rule";

@Injectable({
  providedIn: 'root',
})
export class PickUpPlayerAction implements ActionStrategy {
    ruleSet: ActionRuleSet;
  
    constructor() {
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
      console.log("ActionState frissítve: SET_PATH");
    }
  }