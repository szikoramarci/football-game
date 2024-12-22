export enum Team {
    TEAM_A = 'TEAM_A',
    TEAM_B = 'TEAM_B'
}

export function getOppositeTeam(team: Team): Team {
    return team === Team.TEAM_A ? Team.TEAM_B : Team.TEAM_A
}