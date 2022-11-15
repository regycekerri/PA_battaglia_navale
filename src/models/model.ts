import { Op } from 'sequelize';
import { Grid } from './grid/grid';
import { GridBuilder } from './grid/gridbuilder';
import { getRandomInt } from './grid/utility';
import { User, Game, Move } from './orm';

/**
 * Funzione che verifica l'esistenza di un utente nel database, data la sua email.
 */
 export async function checkIfUserExists(email: string): Promise<boolean> {
    let check: any = await User.findByPk(email, {raw: true});
    if(check) {
        return true;
    } else {
        return false;
    };
}

/**
 * Funzione che restituisce i token appartenenti ad un utente, data la sua email.
 */
export async function getUserTokens(email: string): Promise<number> {
    let user: any = await User.findByPk(email, {raw: true});
    return user.token;
}

/**
 * Funzione che verifica se un utente sta giocando o meno.
 */
export async function isUserPlaying(email: string): Promise<boolean> {
    let user: any = await User.findByPk(email, {raw: true});
    return user.playing;
}

/**
 * Funzione che crea una partita secondo le specifiche fornite. 
 * 
 * Specifiche: grid_size (number), number_of_ships (number), maximum_ship_size (number).
 */
export async function createGame(body: any): Promise<any> {
    const game_mode: number = body.game_mode;
    const email1: string = body.email1;
    const email2: string = body.email2;
    const email3: string = body.email3;
    
    const grid_size: number = body.grid_size;
    const number_of_ships: number = body.number_of_ships;
    let dimensions: number[] = [];
    const maximum_ship_size: number = body.maximum_ship_size;

    for(let i = 0; i < number_of_ships; i++) {
        dimensions.push(getRandomInt(1, maximum_ship_size));
    }

    let grid_player1: Grid = new GridBuilder(grid_size, number_of_ships, maximum_ship_size)
                                            .makeShips(dimensions)
                                            .build();

    let today_date: Date = new Date();

    if(game_mode === 0){
        let grid_IA: Grid = new GridBuilder(grid_size, number_of_ships, maximum_ship_size)
                                          .makeShips(dimensions)
                                          .build();

        let game: any = await Game.create({
            player1: email1,
            player2: null,
            player3: null,
            ia: true,
            grid1: JSON.stringify(grid_player1),
            grid2: null,
            grid3: null,
            gridIA: JSON.stringify(grid_IA),
            attaccante: email1,
            difensore: "ia",
            in_progress: true,
            vincitore: null,
            perdente1: null,
            perdente2: null,
            start_date: today_date.toISOString().slice(0, 10),
            end_date: null
        });
        return game;
    } else if(game_mode === 1) {
        let grid_player2: Grid = new GridBuilder(grid_size, number_of_ships, maximum_ship_size)
                                               .makeShips(dimensions)
                                               .build();

        let game: any = await Game.create({
            player1: email1,
            player2: email2,
            player3: null,
            ia: false,
            grid1: JSON.stringify(grid_player1),
            grid2: JSON.stringify(grid_player2),
            grid3: null,
            gridIA: null,
            attaccante: email1,
            difensore: email2,
            in_progress: true,
            vincitore: null,
            perdente1: null,
            perdente2: null,
            start_date: today_date.toISOString().slice(0, 10),
            end_date: null
        });
        return game;
    } else {
        let grid_player2: Grid = new GridBuilder(grid_size, number_of_ships, maximum_ship_size)
                                                .makeShips(dimensions)
                                                .build();
        let grid_player3: Grid = new GridBuilder(grid_size, number_of_ships, maximum_ship_size)
                                                .makeShips(dimensions)
                                                .build();

        let game: any = await Game.create({
            player1: email1,
            player2: email2,
            player3: email3,
            ia: false,
            grid1: JSON.stringify(grid_player1),
            grid2: JSON.stringify(grid_player2),
            grid3: JSON.stringify(grid_player3),
            gridIA: null,
            attaccante: email1,
            difensore: email2,
            in_progress: true,
            vincitore: null,
            perdente1: null,
            perdente2: null,
            start_date: today_date.toISOString().slice(0, 10),
            end_date: null
        });
        return game;
    }
}

/**
 * Funzione che decrementa i token dell'utente della quantità specificata.
 */
 export async function decreaseTokens(email: string, payment: number): Promise<void> {
    let user: any = await User.findByPk(email);
    user.token = user.token - payment;
    await user.save();
}

/**
 * Funzione che imposta lo stato di un utente, data la sua email.
 */
export async function setUserState(email: string, playing: boolean): Promise<void> {
    let user: any = await User.findByPk(email);
    user.playing = playing;
    await user.save();
}

/**
 * Funzione che verifica l'esistenza di una partita nel database, dato il suo id.
 */
 export async function checkIfGameExists(id_game: number): Promise<boolean> {
    let check: any = await Game.findByPk(id_game, {raw: true});
    if(check) {
        return true;
    } else {
        return false;
    };
}

/**
 * Funzione che verifica se una partita nel database è in corso, dato il suo id.
 */
 export async function checkIfGameIsInProgress(id_game: number): Promise<boolean> {
    let game: any = await Game.findByPk(id_game, {raw: true});

    return game.in_progress;
}

/**
 * Funzione che verifica se è il turno di attacco di un determinato giocatore, data la sua email e la partita.
 */
 export async function checkIfPlayerCanAttack(id_game: number, email: string): Promise<boolean> {
    let game: any = await Game.findByPk(id_game, {raw: true});

    if(game.attaccante === email) {
        return true;
    } else {
        return false;
    }
}

/**
 * Funzione che verifica se una data mossa è ammissibile, ossia se viene attaccata una cella esistente sulla griglia.
 */
 export async function checkIfMoveCanBeDone(id_game: number, x : number, y: number): Promise<boolean> {
    let game: any = await Game.findByPk(id_game, {raw: true});

    let grid: Grid = JSON.parse(game.grid1);
    let grid_size = grid.grid.length;

    if(x >= 1 && x <= grid_size && y >= 1 && y <= grid_size) {
        return true;
    } else {
        return false;
    }
}

/**
 * Funzione che verifica se la mossa non attacca una cella già attaccata in precedenza.
 */
 export async function checkIfMoveIsAlreadyDone(id_game: number, x : number, y: number): Promise<boolean> {
    let game: any = await Game.findByPk(id_game, {raw: true});

    let grid: Grid;

    if(game.difensore === game.player1) {
        grid = JSON.parse(game.grid1);
    } else if(game.difensore === game.player2) {
        grid = JSON.parse(game.grid2);
    } else if(game.difensore === game.player3) {
        grid = JSON.parse(game.grid3);
    } else if(game.difensore === 'ia') {
        grid = JSON.parse(game.gridIA)
    }

    let attacked: boolean = grid.grid[x - 1][y - 1].attacked;

    if(!attacked) {
        return true;
    } else {
        return false;
    }
}

/**
 * Funzione che restituisce una partita, dato il suo id.
 */
 export async function getGameById(id_game: number): Promise<any> {
    let game: any = await Game.findByPk(id_game);
    return game;
}

/**
 * Funzione che crea una mossa nel database, dati i parametri.
 */
export async function createMove(id_game: number, attaccante: string, difensore: string, 
                                 x: number, y: number, colpita_nave: boolean) {
    await Move.create({
        id_game: id_game,
        attaccante: attaccante,
        difensore: difensore,
        x: x,
        y: y,
        colpita_nave: colpita_nave
    }); 
}

/**
 * Restituisce le mosse di una determinata partita, dato il suo id.
 */
export async function getMovesFromGame(id_game: any): Promise<any> {
    let moves: any = await Move.findAll({
        where: {
            id_game: id_game
        },
        order: [['id', 'ASC']]
    });

    return moves;
}

/**
 * Restituisce le partite di un determinato giocatore, data la sua email.
 */
 export async function getPlayerGames(email: string): Promise<any> {
    let games: any = await Game.findAll({
        where: {
            [Op.or]: [{player1: email}, {player2: email}, {player3: email}]
        }
    });

    return games;
}

/**
 * Restituisce le mosse effettuate da un giocatore.
 */
 export async function getPlayerMoves(email: string): Promise<any> {
    let moves: any = await Move.findAll({
        where: {
            attaccante: email
        }
    });

    return moves;
}

/**
 * Restituisce tutti i giocatori.
 */
 export async function getAllPlayers(): Promise<any> {
    let players: any = await User.findAll();

    return players;
}

/**
 * Restituisce tutte le partite terminate.
 */
 export async function getAllFinishedGames(): Promise<any> {
    let games: any = await Game.findAll({
        where: {
            in_progress: false
        }
    });

    return games;
}

/**
 * Funzione che verifica se l'utente specificato è l'admin.
 */
 export async function checkIfAdmin(email: string): Promise<boolean> {
    let user: any = await User.findByPk(email, {raw: true});
    
    if(user !== null || user !== undefined) {
        return user.role === 'admin';
    } else {
        return false;
    }
}

/**
 * Funzione che ricarica i token dell'utente della quantità specificata.
 */
 export async function refillTokens(email: string, refill: number): Promise<void> {
    let user: any = await User.findByPk(email);
    user.token = user.token + refill;
    await user.save();
}