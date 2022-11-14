import { ErrorEnum, ErrorFactory } from "./responses/error";
import * as Model from "./models/model";
import { SuccessEnum, SuccessFactory } from "./responses/success";
import { Grid } from "./models/grid/grid";
import { getRandomInt } from "./models/grid/utility";
import { Move } from "./models/moves/move";
import fs = require('fs');
import path = require('path');
import { Game } from "./models/games/game";

/**
 * Funzione che verifica se gli utenti specificati all'atto di creazione di una partita esistono o meno.
 */
 export async function checkIfUsersExist(game_mode: number, email1: string, email2: string, email3: string, res: any): Promise<boolean> {
    let check1: boolean;
    let check2: boolean;
    let check3: boolean;
    let check: boolean = false;

    try {
        if(game_mode === 0){
            check1 = await Model.checkIfUserExists(email1);
            check = check1;
        } else if(game_mode === 1) {
            check1 = await Model.checkIfUserExists(email1);
            check2 = await Model.checkIfUserExists(email2);
            check = check1 && check2;
        } else {
            check1 = await Model.checkIfUserExists(email1);
            check2 = await Model.checkIfUserExists(email2);
            check3 = await Model.checkIfUserExists(email3);
            check = check1 && check2 && check3;
        }
    } catch(e) {
        generateControllerErrors(ErrorEnum.InternalServer, e, res);
    }

    return check;
}

/**
 * Funzione che verifica se gli utenti specificati all'atto di creazione di una partita abbiano i token necessari.
 */
 export async function checkIfUsersHaveTokens(game_mode: number, email1: string, email2: string, email3: string, res: any): Promise<boolean> {
    let tokens1: number;
    let tokens2: number;
    let tokens3: number;
    let check: boolean = false;

    try {
        if(game_mode === 0){
            tokens1 = await Model.getUserTokens(email1);
            check = tokens1 >= 0.4;
        } else if(game_mode === 1) {
            tokens1 = await Model.getUserTokens(email1);
            tokens2 = await Model.getUserTokens(email2);
            check = (tokens1 >= 0.4) && (tokens2 >= 0.4);
        } else {
            tokens1 = await Model.getUserTokens(email1);
            tokens2 = await Model.getUserTokens(email2);
            tokens3 = await Model.getUserTokens(email3);
            check = (tokens1 >= 0.4) && (tokens2 >= 0.4) && (tokens3 >= 0.4);
        }
    } catch(e) {
        generateControllerErrors(ErrorEnum.InternalServer, e, res);
    }

    return check;
}

/**
 * Funzione che verifica se gli utenti specificati all'atto di creazione di una partita non stiano già giocando.
 */
 export async function checkIfUsersArePlaying(game_mode: number, email1: string, email2: string, email3: string, res: any): Promise<boolean> {
    let playing1: boolean;
    let playing2: boolean;
    let playing3: boolean;
    let check: boolean = false;

    try {
        if(game_mode === 0){
            playing1 = await Model.isUserPlaying(email1);
            check = !playing1;
        } else if(game_mode === 1) {
            playing1 = await Model.isUserPlaying(email1);
            playing2 = await Model.isUserPlaying(email2);
            check = !playing1 && !playing2;
        } else {
            playing1 = await Model.isUserPlaying(email1);
            playing2 = await Model.isUserPlaying(email2);
            playing3 = await Model.isUserPlaying(email3);
            check = !playing1 && !playing2 && !playing3;
        }
    } catch(e) {
        generateControllerErrors(ErrorEnum.InternalServer, e, res);
    }

    return check;
}

/**
 * Funzione che crea una partita sulla base delle specifiche fornite.
 * In caso di successo, vengono decrementati i token dei giocatori e la risposta restituita conferma la creazione.
 */
export async function createGame(body: any, res: any): Promise<void> {
    const game_mode: number = body.game_mode;
    const email1: string = body.email1;
    const email2: string = body.email2;
    const email3: string = body.email3;

    try {
        let game: any = await Model.createGame(body);

        if(game) {
            if(game_mode === 0) {
                await Model.decreaseTokens(email1, 0.4);
                await Model.setUserState(email1, true);
            } else if(game_mode === 1) {
                await Model.decreaseTokens(email1, 0.4);
                await Model.decreaseTokens(email2, 0.4);
                await Model.setUserState(email1, true);
                await Model.setUserState(email2, true);
            } else {
                await Model.decreaseTokens(email1, 0.4);
                await Model.decreaseTokens(email2, 0.4);
                await Model.decreaseTokens(email3, 0.4);
                await Model.setUserState(email1, true);
                await Model.setUserState(email2, true);
                await Model.setUserState(email3, true);
            }
    
            const successFactory = new SuccessFactory();
            const success = successFactory.getSuccess(SuccessEnum.GameCreated);
            res.status(success.getStatus()).json({
                message: success.getMsg(),
                id_game: game.id,
                player1: game.player1,
                player2: game.player2,
                player3: game.player3,
                ia: game.ia
            });
            
        } else {
            throw new Error();
        }
    } catch(error) {
        generateControllerErrors(ErrorEnum.InternalServer, error, res);
    }
}

/**
 * Funzione che verifica se la partita specificata esiste o meno.
 */
 export async function checkIfGameExists(id_game: number, res: any): Promise<boolean> {
    let check: boolean = false;
    try {
        check = await Model.checkIfGameExists(id_game); 
    } catch(e) {
        generateControllerErrors(ErrorEnum.InternalServer, e, res);
    }
    
    return check;
}

/**
 * Funzione che verifica se la partita specificata è in corso o meno.
 */
 export async function checkIfGameIsInProgress(id_game: number, res: any): Promise<boolean> {
    let check: boolean = false;
    try {
        check = await Model.checkIfGameIsInProgress(id_game); 
    } catch(e) {
        generateControllerErrors(ErrorEnum.InternalServer, e, res);
    }
    
    return check;
}

/**
 * Funzione che verifica se è il turno del giocatore specificato.
 */
 export async function checkIfPlayerCanAttack(id_game: number, email: string, res: any): Promise<boolean> {
    let check: boolean = false;
    try {
        check = await Model.checkIfPlayerCanAttack(id_game, email); 
    } catch(e) {
        generateControllerErrors(ErrorEnum.InternalServer, e, res);
    }
    
    return check;
}

/**
 * Funzione che verifica se una mossa è ammissibile (ossia se non si attacca una cella inesistente).
 */
 export async function checkIfMoveCanBeDone(id_game: number, x: number, y: number, res: any): Promise<boolean> {
    let check: boolean = false;
    try {
        check = await Model.checkIfMoveCanBeDone(id_game, x, y); 
    } catch(e) {
        console.log(e);
        generateControllerErrors(ErrorEnum.InternalServer, e, res);
    }
    
    return check;
}

/**
 * Funzione che verifica se una mossa non sia stata già effettuata.
 */
 export async function checkIfMoveIsAlreadyDone(id_game: number, x: number, y: number, res: any): Promise<boolean> {
    let check: boolean = false;
    try {
        check = await Model.checkIfMoveIsAlreadyDone(id_game, x, y); 
    } catch(e) {
        console.log(e);
        generateControllerErrors(ErrorEnum.InternalServer, e, res);
    }
    
    return check;
}

/**
 * Funzione che effettua una mossa contro l'ia.
 */
export async function makeMoveVsIA(body: any, game: any, res: any): Promise<void> {
    const id_game: number = body.id_game;
    const attaccante: string = body.email;
    const x: number = body.x;
    const y: number = body.y;

    try {
        //Attacchiamo la cella dell'ia
        let gridIA: Grid = JSON.parse(game.gridIA);
        let colpita_nave: boolean = false;
        gridIA.grid[x - 1][y - 1].attacked = true;
        if(gridIA.grid[x - 1][y - 1].type !== 0) {
            gridIA.grid[x - 1][y - 1].type = 0;
            colpita_nave = true;
        }

        await Model.createMove(id_game, attaccante, 'ia', x, y, colpita_nave);
        await Model.decreaseTokens(attaccante, 0.01);

        //Verifico se ci sono altre navi, in caso negativo la mossa è conclusiva
        let partita_finita: boolean = true;
        for(let i = 0; i < gridIA.grid.length; i++) {
            for(let j = 0; j < gridIA.grid.length; j++) {
                if(gridIA.grid[i][j].type !== 0) {
                    partita_finita = false;
                }
            }
        }
        
        //Se la mossa è conclusiva...
        if(partita_finita) {
            game.gridIA = JSON.stringify(gridIA);
            game.attaccante = null;
            game.difensore = null;
            game.in_progress = false;
            game.vincitore = attaccante;
            game.perdente1 = "ia";
            game.end_date = new Date().toISOString().slice(0, 10);

            await game.save();
            await Model.setUserState(attaccante, false);

            const successFactory = new SuccessFactory();
            const success = successFactory.getSuccess(SuccessEnum.MoveExecuted);
            res.status(success.getStatus()).json({
                message: success.getMsg(),
                attaccante: attaccante,
                difensore: 'ia',
                esito: "Complimenti, hai vinto!"
            });
        } else {
            game.gridIA = JSON.stringify(gridIA);

            //L'ia risponde con la sua mossa
            let grid1: Grid = JSON.parse(game.grid1)
            let colpita_nave1: boolean = false;
            //La mossa dell'ia è casuale
            let continua_tentativo: boolean = true;
            let x_ia: number;
            let y_ia: number;
            do {
                x_ia = getRandomInt(1, grid1.grid.length);
                y_ia = getRandomInt(1, grid1.grid.length);

                if(grid1.grid[x_ia - 1][y_ia - 1].attacked !== true) {
                    continua_tentativo = false;
                }
            } while(continua_tentativo);
            grid1.grid[x_ia - 1][y_ia - 1].attacked = true;
            if(grid1.grid[x_ia - 1][y_ia - 1].type !== 0) {
                grid1.grid[x_ia - 1][y_ia - 1].type = 0;
                colpita_nave1 = true;
            }

            await Model.createMove(id_game, 'ia', attaccante, x_ia, y_ia, colpita_nave1);
            await Model.decreaseTokens(attaccante, 0.01);

            //Verifico se ci sono altre navi, in caso negativo la mossa è conclusiva
            let partita_finita_ia: boolean = true;
            for(let i = 0; i < grid1.grid.length; i++) {
                for(let j = 0; j < grid1.grid.length; j++) {
                    if(grid1.grid[i][j].type !== 0) {
                        partita_finita_ia = false;
                    }
                }
            }

            //Se la mossa è conclusiva...
            if(partita_finita_ia) {
                game.grid1 = JSON.stringify(grid1);
                game.attaccante = null;
                game.difensore = null;
                game.in_progress = false;
                game.vincitore = 'ia';
                game.perdente1 = attaccante;
                game.end_date = new Date().toISOString().slice(0, 10);

                await game.save();
                await Model.setUserState(attaccante, false);

                const successFactory = new SuccessFactory();
                const success = successFactory.getSuccess(SuccessEnum.MoveExecuted);
                res.status(success.getStatus()).json({
                    message: success.getMsg(),
                    attaccante: attaccante,
                    difensore: 'ia',
                    esito: "L'ia ha risposto alla tua mossa, hai perso!"
                });
            } else {
                game.grid1 = JSON.stringify(grid1);
                
                await game.save();
                const successFactory = new SuccessFactory();
                const success = successFactory.getSuccess(SuccessEnum.MoveExecuted);
                res.status(success.getStatus()).json({
                    message: success.getMsg(),
                    attaccante: attaccante,
                    difensore: 'ia',
                    esito: "L'ia ha risposto alla tua mossa, è di nuovo il tuo turno!",
                    colpita_nave: colpita_nave
                });
            }
        }
    } catch(error) {
        console.log(error);
        generateControllerErrors(ErrorEnum.InternalServer, error, res);
    }
}

/**
 * Funzione che effettua una mossa contro un altro giocatore (in una partita pvp).
 */
 export async function makeMoveVsPlayer(body: any, game: any, res: any): Promise<void> {
    const id_game: number = body.id_game;
    const attaccante: string = body.email;
    const x: number = body.x;
    const y: number = body.y;
    let difensore: string;

    try {
        //Attacchiamo la cella dell'altro giocatore
        let grid: Grid;
        if(attaccante === game.player1) {
            grid = JSON.parse(game.grid2);
            difensore = game.player2;
        } else {
            grid = JSON.parse(game.grid1);
            difensore = game.player1;
        }
        let colpita_nave: boolean = false;
        grid.grid[x - 1][y - 1].attacked = true;
        if(grid.grid[x - 1][y - 1].type !== 0) {
            grid.grid[x - 1][y - 1].type = 0;
            colpita_nave = true;
        }

        await Model.createMove(id_game, attaccante, difensore, x, y, colpita_nave);
        await Model.decreaseTokens(attaccante, 0.01);
        await Model.decreaseTokens(difensore, 0.01);

        //Verifico se ci sono altre navi, in caso negativo la mossa è conclusiva
        let partita_finita: boolean = true;
        for(let i = 0; i < grid.grid.length; i++) {
            for(let j = 0; j < grid.grid.length; j++) {
                if(grid.grid[i][j].type !== 0) {
                    partita_finita = false;
                }
            }
        }
        
        //Se la mossa è conclusiva...
        if(partita_finita) {
            if(attaccante === game.player1) {
                game.grid2 = JSON.stringify(grid);
            } else{
                game.grid1 = JSON.stringify(grid);
            }
            game.attaccante = null;
            game.difensore = null;
            game.in_progress = false;
            game.vincitore = attaccante;
            game.perdente1 = difensore;
            game.end_date = new Date().toISOString().slice(0, 10);

            await game.save();
            await Model.setUserState(attaccante, false);
            await Model.setUserState(difensore, false);

            const successFactory = new SuccessFactory();
            const success = successFactory.getSuccess(SuccessEnum.MoveExecuted);
            res.status(success.getStatus()).json({
                message: success.getMsg(),
                attaccante: attaccante,
                difensore: difensore,
                esito: "Complimenti, hai vinto!"
            });
        } else {
            if(attaccante === game.player1) {
                game.grid2 = JSON.stringify(grid);
            } else{
                game.grid1 = JSON.stringify(grid);
            }
            game.attaccante = difensore;
            game.difensore = attaccante;
                
            await game.save();

            const successFactory = new SuccessFactory();
            const success = successFactory.getSuccess(SuccessEnum.MoveExecuted);
            res.status(success.getStatus()).json({
                message: success.getMsg(),
                attaccante: attaccante,
                difensore: difensore,
                esito: "Hai effettuato la tua mossa, ora è il turno dell'altro giocatore!",
                colpita_nave: colpita_nave
                });
            }
    } catch(error) {
        console.log(error);
        generateControllerErrors(ErrorEnum.InternalServer, error, res);
    }
}

/**
 * Funzione che effettua una mossa contro un altro giocatore (in una partita pvpvp).
 */
 export async function makeMoveVsPlayers(body: any, game: any, res: any): Promise<void> {
    const id_game: number = body.id_game;
    const attaccante: string = body.email;
    const x: number = body.x;
    const y: number = body.y;
    let difensore: string = game.difensore;

    try {
        if(game.perdente2 !== null) {
            //Caso 1: sono rimasti due giocatori in gioco
            //Attacchiamo la cella dell'altro giocatore
            let grid: Grid;
            if(difensore === game.player1) {
                grid = JSON.parse(game.grid1);
            } else if(difensore === game.player2) {
                grid = JSON.parse(game.grid2);
            } else {
                grid = JSON.parse(game.grid3);
            }
            let colpita_nave: boolean = false;
            grid.grid[x - 1][y - 1].attacked = true;
            if(grid.grid[x - 1][y - 1].type !== 0) {
                grid.grid[x - 1][y - 1].type = 0;
                colpita_nave = true;
            }

            await Model.createMove(id_game, attaccante, difensore, x, y, colpita_nave);
            await Model.decreaseTokens(game.player1, 0.01);
            await Model.decreaseTokens(game.player2, 0.01);
            await Model.decreaseTokens(game.player3, 0.01);

            //Verifico se ci sono altre navi, in caso negativo la mossa è conclusiva
            let partita_finita: boolean = true;
            for(let i = 0; i < grid.grid.length; i++) {
                for(let j = 0; j < grid.grid.length; j++) {
                    if(grid.grid[i][j].type !== 0) {
                        partita_finita = false;
                    }
                }
            }

            //Se la mossa è conclusiva...
            if(partita_finita) {
                if(difensore === game.player1) {
                    game.grid1 = JSON.stringify(grid);
                } else if(difensore === game.player2) {
                    game.grid2 = JSON.stringify(grid);
                } else {
                    game.grid3 = JSON.stringify(grid);
                }

                game.attaccante = null;
                game.difensore = null;
                game.in_progress = false;
                game.vincitore = attaccante;
                game.perdente1 = difensore;
                game.end_date = new Date().toISOString().slice(0, 10);

                await game.save();
                await Model.setUserState(game.player1, false);
                await Model.setUserState(game.player2, false);
                await Model.setUserState(game.player3, false);

                const successFactory = new SuccessFactory();
                const success = successFactory.getSuccess(SuccessEnum.MoveExecuted);
                res.status(success.getStatus()).json({
                    message: success.getMsg(),
                    attaccante: attaccante,
                    difensore: difensore,
                    esito: "Complimenti, hai vinto!"
                });
            } else {
                if(difensore === game.player1) {
                    game.grid1 = JSON.stringify(grid);
                } else if(difensore === game.player2) {
                    game.grid2 = JSON.stringify(grid);
                } else {
                    game.grid3 = JSON.stringify(grid);
                }

                game.attaccante = difensore;
                game.difensore = attaccante;

                await game.save();

                const successFactory = new SuccessFactory();
                const success = successFactory.getSuccess(SuccessEnum.MoveExecuted);
                res.status(success.getStatus()).json({
                    message: success.getMsg(),
                    attaccante: attaccante,
                    difensore: difensore,
                    esito: "Hai effettuato la tua mossa, ora è il turno dell'altro giocatore!",
                    colpita_nave: colpita_nave
                });
            }
        } else {
            //Caso 2: sono rimasti tre giocatori in gioco
            //Attacchiamo la cella dell'altro giocatore
            let grid: Grid;
            if(difensore === game.player1) {
                grid = JSON.parse(game.grid1);
            } else if(difensore === game.player2) {
                grid = JSON.parse(game.grid2);
            } else {
                grid = JSON.parse(game.grid3);
            }
            let colpita_nave: boolean = false;
            grid.grid[x - 1][y - 1].attacked = true;
            if(grid.grid[x - 1][y - 1].type !== 0) {
                grid.grid[x - 1][y - 1].type = 0;
                colpita_nave = true;
            }

            await Model.createMove(id_game, attaccante, difensore, x, y, colpita_nave);
            await Model.decreaseTokens(game.player1, 0.01);
            await Model.decreaseTokens(game.player2, 0.01);
            await Model.decreaseTokens(game.player3, 0.01);

            //Verifico se ci sono altre navi, in caso negativo la mossa è quella che sconfigge uno dei giocatori
            let giocatore_sconfitto: boolean = true;
            for(let i = 0; i < grid.grid.length; i++) {
                for(let j = 0; j < grid.grid.length; j++) {
                    if(grid.grid[i][j].type !== 0) {
                        giocatore_sconfitto = false;
                    }
                }
            }

            //Se la mossa sconfigge il giocatore...
            if(giocatore_sconfitto) {
                if(difensore === game.player1) {
                    game.grid1 = JSON.stringify(grid);
                    if(attaccante === game.player2) {
                        game.attaccante = game.player3;
                    } else {
                        game.attaccante = game.player2;
                    }
                } else if(difensore === game.player2) {
                    game.grid2 = JSON.stringify(grid);
                    if(attaccante === game.player1) {
                        game.attaccante = game.player3;
                    } else {
                        game.attaccante = game.player1;
                    }
                } else {
                    game.grid3 = JSON.stringify(grid);
                    if(attaccante === game.player1) {
                        game.attaccante = game.player2;
                    } else {
                        game.attaccante = game.player1;
                    }
                }
                game.difensore = attaccante;
                game.perdente2 = difensore;

                await game.save();

                const successFactory = new SuccessFactory();
                const success = successFactory.getSuccess(SuccessEnum.MoveExecuted);
                res.status(success.getStatus()).json({
                    message: success.getMsg(),
                    attaccante: attaccante,
                    difensore: difensore,
                    esito: "Hai sconfitto un giocatore, ne rimane un altro!"
                });
            } else {
                if(difensore === game.player1) {
                    game.grid1 = JSON.stringify(grid);
                } else if(difensore === game.player2) {
                    game.grid2 = JSON.stringify(grid);
                } else {
                    game.grid3 = JSON.stringify(grid);
                }

                //Si rispetta la turnazione
                if(attaccante === game.player1 && difensore === game.player2) {
                    game.attaccante = game.player3;
                    game.difensore = game.player1;
                } else if(attaccante === game.player3 && difensore === game.player1) {
                    game.attaccante = game.player2;
                    game.difensore = game.player3;
                } else if(attaccante === game.player2 && difensore === game.player3) {
                    game.attaccante = game.player3;
                    game.difensore = game.player2;
                } else if(attaccante === game.player3 && difensore === game.player2) {
                    game.attaccante = game.player1;
                    game.difensore = game.player3;
                } else if(attaccante === game.player1 && difensore === game.player3) {
                    game.attaccante = game.player2;
                    game.difensore = game.player1;
                } else if(attaccante === game.player2 && difensore === game.player1) {
                    game.attaccante = game.player1;
                    game.difensore = game.player2;
                }

                await game.save();

                const successFactory = new SuccessFactory();
                const success = successFactory.getSuccess(SuccessEnum.MoveExecuted);
                res.status(success.getStatus()).json({
                    message: success.getMsg(),
                    attaccante: attaccante,
                    difensore: difensore,
                    esito: "Hai effettuato la tua mossa, ora è il turno dell'altro giocatore!",
                    colpita_nave: colpita_nave
                });
            }
        }
    } catch(error) {
        console.log(error);
        generateControllerErrors(ErrorEnum.InternalServer, error, res);
    }
}

/**
 * Funzione che restituisce lo stato di una partita, dato il suo id.
 */
 export async function showGameState(body: any, res: any): Promise<void> {
    const id_game: number = body.id_game;

    try {
        let game: any = await Model.getGameById(id_game);

        const successFactory = new SuccessFactory();
        const success = successFactory.getSuccess(SuccessEnum.GameStateShown);
        res.status(success.getStatus()).json({
            message: success.getMsg(),
            id: game.id,
            player1: game.player1,
            player2: game.player2,
            player3: game.player3,
            ia: game.ia,
            grid1: JSON.parse(game.grid1), 
            grid2: JSON.parse(game.grid2),
            grid3: JSON.parse(game.grid3),
            gridIA: JSON.parse(game.gridIA),
            attaccante: game.attaccante,
            difensore: game.difensore,
            in_progress: game.in_progress,
            vincitore: game.vincitore,
            perdente1: game.perdente1,
            perdente2: game.perdente2,
            start_date: game.start_date,
            end_date: game.end_date
        });
    } catch (error) {
        generateControllerErrors(ErrorEnum.InternalServer, error, res);
    }
}

/**
 * Funzione che restituisce le mosse di una partita e genera o meno un file .csv a seconda delle richieste
 * dell'utente.
 */
 export async function showGameMoves(body: any, res: any): Promise<void> {
    try {
        let moves: any[] = await Model.getMovesFromGame(body.id_game);

        let moves_array: Move[] = [];
        for(let i = 0; i < moves.length; i++) {
            moves_array.push(new Move(
                moves[i].id,
                moves[i].id_game,
                moves[i].attaccante,
                moves[i].difensore,
                moves[i].x,
                moves[i].y,
                moves[i].colpita_nave
            ));
        }

        //Stampo il file csv se specificato
        if(body.csv === true) {
            let csv_file: string = `ID; ID_GAME; ATTACCANTE; DIFENSORE; X; Y; COLPITA_NAVE\n`;
            for(let i = 0; i < moves_array.length; i++) {
                csv_file += `${moves_array[i].id}; ${moves_array[i].id_game}; ${moves_array[i].attaccante}; ${moves_array[i].difensore}; ${moves_array[i].x}; ${moves_array[i].y}; ${moves_array[i].colpita_nave}\n`;
            }
            fs.writeFileSync('moves.csv', csv_file);
        }

        const successFactory = new SuccessFactory();
        const success = successFactory.getSuccess(SuccessEnum.GameMovesShown);
        res.status(success.getStatus()).json({
            message: success.getMsg(),
            id_game: body.id_game,
            moves: moves_array
        });
    } catch (error) {
        console.log(error);
        generateControllerErrors(ErrorEnum.InternalServer, error, res);
    }
}

/**
 * Funzione che restituisce le statistiche di un determinato giocatore, riferite ad un intervallo di tempo.
 */
 export async function showPlayerStats(body: any, res: any): Promise<void> {
    try {
        let games: any[] = await Model.getPlayerGames(body.email);
        let data_inizio: Date = new Date(body.data_inizio);
        let data_fine: Date = new Date(body.data_fine);

        //Partite totali (terminate e in corso)
        let partite_totali: Game[] = [];
        for(let i = 0; i < games.length; i++) {
            partite_totali.push(new Game(
                games[i].id,
                games[i].player1,
                games[i].player2,
                games[i].player3,
                games[i].ia,
                games[i].grid1,
                games[i].grid2,
                games[i].grid3,
                games[i].gridIA,
                games[i].attaccante,
                games[i].difensore,
                games[i].in_progress,
                games[i].vincitore,
                games[i].perdente1,
                games[i].perdente2,
                games[i].start_date,
                games[i].end_date
            ))
        }

        //Trovo le partite giocate (terminate) nell'intervallo di tempo specificato
        let partite_giocate: Game[] = partite_totali.filter(element => element.in_progress === false)
        .filter(element => (element.start_date >= data_inizio && element.end_date <= data_fine));

        //Se non ha giocato nessuna partita...
        if(partite_giocate.length === 0) {
            const successFactory = new SuccessFactory();
            const success = successFactory.getSuccess(SuccessEnum.PlayerStatsShown);
            res.status(success.getStatus()).json({
                message: success.getMsg(),
                player: body.email,
                partite_giocate: partite_giocate.length,
                partite_vinte: 0,
                partite_perse: 0,
                numero_minimo_di_mosse_per_partita: 0,
                numero_massimo_di_mosse_per_partita: 0,
                numero_medio_di_mosse_per_partita: 0,
                deviazione_standard_delle_mosse_per_partita: 0
            });
        } else {
            //Trovo le partite vinte
            let partite_vinte: Game[] = partite_giocate.filter(element => element.vincitore === body.email);
        
            //Trovo le partite perse
            let partite_perse: Game[] = partite_giocate.filter(element => 
                (element.perdente1 === body.email) || (element.perdente2 === body.email));
        
            //Mosse effettuate dal giocatore
            let moves: any[] = await Model.getPlayerMoves(body.email);
            let moves_array: Move[] = [];

            for(let i = 0; i < moves.length; i++) {
                moves_array.push(new Move(
                    moves[i].id,
                    moves[i].id_game,
                    moves[i].attaccante,
                    moves[i].difensore,
                    moves[i].x,
                    moves[i].y,
                    moves[i].colpita_nave
                ));
            }

            let moves_per_game: number[] = [];

            partite_giocate.forEach(game => {
                moves_per_game.push(moves_array.filter(element => element.id_game === game.id).length);
            });

            //Calcolo la media
            let media: number = moves_per_game.reduce((a, b) => a + b) / moves_per_game.length;

            //Calcolo la deviazione standard
            let scarti_quadratici: number[] = moves_per_game.map(moves => Math.pow(moves - media, 2))

            let varianza: number;
            if(moves_per_game.length > 1) {
                varianza = scarti_quadratici.reduce((a, b) => a + b) / (moves_per_game.length - 1);
            } else {
                varianza = 0;
            }

            let deviazione_standard = Math.sqrt(varianza);

            const successFactory = new SuccessFactory();
            const success = successFactory.getSuccess(SuccessEnum.PlayerStatsShown);
            res.status(success.getStatus()).json({
                message: success.getMsg(),
                player: body.email,
                partite_giocate: partite_giocate.length,
                partite_vinte: partite_vinte.length,
                partite_perse: partite_perse.length,
                numero_minimo_di_mosse_per_partita: Math.min(...moves_per_game),
                numero_massimo_di_mosse_per_partita: Math.max(...moves_per_game),
                numero_medio_di_mosse_per_partita: media,
                deviazione_standard_delle_mosse_per_partita: deviazione_standard
            });
        }
    } catch (error) {
        console.log(error);
        generateControllerErrors(ErrorEnum.InternalServer, error, res);
    }
}

/**
 * Funzione che verifica se il giocatore specificato esiste o meno.
 */
 export async function checkIfPlayerExists(email: string, res: any): Promise<boolean> {
    let check: boolean = false;

    try {
        check = await Model.checkIfUserExists(email);
    } catch (e) {
        generateControllerErrors(ErrorEnum.InternalServer, e, res);
    }
    return check;
}

/**
 * Funzione invocata dai metodi del Controller in caso di errori che sfrutta la ErrorFactory per generare gli errori da
 * restituire al client nella risposta.
 */
 function generateControllerErrors(error_enum: ErrorEnum, err: Error, res: any) {
    const errorFactory = new ErrorFactory();
    const error = errorFactory.getError(error_enum);
    res.status(error.getStatus()).json({
        status: error.getStatus(),
        error: error.getMsg()
    });
}