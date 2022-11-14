/**
 * Classe che rappresenta un singolo giocatore.
 */
 export class Player {
    readonly email: string;
    readonly username: string;
    wins: number;
    losses: number;
    total_games: number;

    constructor(email: string, username: string, wins: number, losses: number, total_games: number) {
        this.email = email;
        this.username = username;
        this.wins = wins;
        this.losses = losses;
        this.total_games = total_games;
    }
}