export class Move {
    readonly id: number;
    readonly id_game: number;
    readonly attaccante: string;
    readonly difensore: string;
    readonly x: number;
    readonly y: number;
    readonly colpita_nave: boolean;

    constructor(id: number, id_game: number, attaccante: string, difensore: string, 
                x: number, y: number, colpita_nave: boolean) {
        this.id = id;
        this.id_game = id_game;
        this.attaccante = attaccante;
        this.difensore = difensore;
        this.x = x;
        this.y = y;
        this.colpita_nave = colpita_nave;
    }
}