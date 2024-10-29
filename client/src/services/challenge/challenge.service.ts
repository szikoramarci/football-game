import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ChallengeService {

    dribbleTackleChallenge() {
        return this.rollDice() == 6
    }

    rollDice(): number {
        const diceValue = Math.floor(Math.random() * 6) + 1;
        console.log(diceValue)
        return diceValue
    }
}