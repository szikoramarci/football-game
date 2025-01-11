import { getOppositeTeam, Team } from "../models/team.enum";
import { RelocationTurn } from "./relocation-turn.interface";

export function generateMovementPhase(attackingTeam: Team): RelocationTurn[] {

    const attackingTeamRelocationTurnFirst: RelocationTurn = {
        team: attackingTeam,
        movementLimit: 'ownSpeed',
        movementType: 'steps'
    }

    const defendingTeamRelocationTurn: RelocationTurn = {
        team: getOppositeTeam(attackingTeam),
        movementLimit: 'ownSpeed',
        movementType: 'steps'
    }

    const attackingTeamRelocationTurnSecond: RelocationTurn = {
        team: attackingTeam,
        movementLimit: 2,
        movementType: 'steps'
    }

    // for test
    return [
        defendingTeamRelocationTurn,
        defendingTeamRelocationTurn,
        defendingTeamRelocationTurn,
        defendingTeamRelocationTurn,
    ]

    return [
        // 3X attacking team - own speed
        // should be 4X, but the first step is already done
        // because the first movement has triggered the action
        attackingTeamRelocationTurnFirst,
        attackingTeamRelocationTurnFirst,
        attackingTeamRelocationTurnFirst,
        // 5X defending team - own speed
        defendingTeamRelocationTurn,
        defendingTeamRelocationTurn,
        defendingTeamRelocationTurn,
        defendingTeamRelocationTurn,
        defendingTeamRelocationTurn,
        // 2X attacking team - 2 steps
        attackingTeamRelocationTurnSecond,
        attackingTeamRelocationTurnSecond
    ]    
}