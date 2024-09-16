import { Injectable } from "@angular/core";
import { IsOwnPlayer } from "../../actions/rules/is-own-player.rule";
import { IsAlreadyPicked } from "../../actions/rules/is-already-picked.rule";
import { IsEmpty } from "../../actions/rules/is-empty.rule";
import { IsNotPicked } from "../../actions/rules/is-not-picked.rule";
import { IsPlayerSelected } from "../../actions/rules/is-player-selected.rule";
import { ActionType } from "../../actions/action.type.enum";
import { ActionRule } from "../../actions/action.rule.interface";

@Injectable({
    providedIn: 'root'
})
export class ActionService {

    rules: { [key in ActionType]?: ActionRule[] } = {};

    constructor() {
        this.initPickPlayerAction();
        this.initMovePlayerAction();
    }

    initPickPlayerAction(){
        this.addRule(ActionType.PickPlayer, new IsPlayerSelected());
        this.addRule(ActionType.PickPlayer, new IsOwnPlayer());
        this.addRule(ActionType.PickPlayer, new IsAlreadyPicked());
    }

    initMovePlayerAction(){
        this.addRule(ActionType.MovePlayer, new IsEmpty());
        this.addRule(ActionType.MovePlayer, new IsNotPicked());
    }

    addRule(type: ActionType, rule: ActionRule): void {
        if (!this.rules[type]) {
          this.rules[type] = [];
        }
        this.rules[type]?.push(rule);
    }

    validate(ActionType: ActionType, context: any): boolean {
        const ActionRules = this.rules[ActionType];
        if (!ActionRules) {
          return true;
        }
    
        const errors = ActionRules
            .filter(rule => !rule.isValid(context))
            .map(rule => {
                console.log(rule.errorMessage)
                return rule;
            })
    
        return errors.length === 0;
      }
}