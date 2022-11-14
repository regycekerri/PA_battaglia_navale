/**
 * Classe che rappresenta una singola partita.
 */
export class Game {
    readonly id: number;
    readonly player1: string;
    readonly player2: string;
    readonly player3: string;
    readonly ia: boolean;
    readonly grid1: string;
    readonly grid2: string;
    readonly grid3: string;
    readonly gridIA: string;
    readonly attaccante: string;
    readonly difensore: string;
    readonly in_progress: boolean;
    readonly vincitore: string;
    readonly perdente1: string;
    readonly perdente2: string;
    readonly start_date: Date;
    readonly end_date: Date;

    constructor(id: number, player1: string, player2: string, player3: string, ia: boolean, grid1: string, 
                grid2: string, grid3: string, gridIA: string, attaccante: string, difensore: string,
                in_progress: boolean, vincitore: string, perdente1: string, perdente2: string, start_date: string, 
                end_date: string) {
        this.id = id;
        this.player1 = player1;
        this.player2 = player2;
        this.player3 = player3;
        this.ia = ia;
        this.grid1 = grid1;
        this.grid2 = grid2;
        this.grid3 = grid3;
        this.gridIA = gridIA;
        this.attaccante = attaccante;
        this.difensore = difensore;
        this.in_progress = in_progress;
        this.vincitore = vincitore;
        this.perdente1 = perdente1;
        this.perdente2 = perdente2;
        this.start_date = new Date(start_date);
        this.end_date = new Date(end_date);
    }
}