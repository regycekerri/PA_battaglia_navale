import * as Controller from "../controller";
import { ErrorEnum } from "../responses/error";

/**
 * Verifica che gli utenti specificati all'atto di creazione di una partita esistano effettivamente nel database, 
 * attraverso il metodo del Controller, e siano diversi tra loro.
 */
 export function checkUsersExistence(req: any, res: any, next: any) : void {
    Controller.checkIfUsersExist(req.body.game_mode, req.body.email1, req.body.email2, req.body.email3, res).then((check) => {
        if(check) {
            if(req.body.game_mode === 0) {
                console.log("checkUsersExistence: SUCCESS");
                next();
            } else if(req.body.game_mode === 1) {
                if(req.body.email1 !== req.body.email2) {
                    console.log("checkUsersExistence: SUCCESS");
                    next();
                } else {
                    console.log("checkUsersExistence: FAIL");
                    next(ErrorEnum.MatchingUsers);
                }
            } else {
                if((req.body.email1 !== req.body.email2) && (req.body.email1 !== req.body.email3) && (req.body.email2 !== req.body.email3)) {
                    console.log("checkUsersExistence: SUCCESS");
                    next();
                } else {
                    console.log("checkUsersExistence: FAIL");
                    next(ErrorEnum.MatchingUsers);
                }
            }
        } else {
            console.log("checkUsersExistence: FAIL");
            next(ErrorEnum.NotExistingUser);
        }
    })
}

/**
 * Verifica che gli utenti specificati all'atto di creazione di una partita abbiano i token necessari, attraverso 
 * il metodo del Controller.
 */
 export function checkUsersTokens(req: any, res: any, next: any) : void {
    Controller.checkIfUsersHaveTokens(req.body.game_mode, req.body.email1, req.body.email2, req.body.email3, res).then((check) => {
        if(check) {
            console.log("checkUsersTokens: SUCCESS");
            next();
        } else {
            console.log("checkUsersTokens: FAIL");
            next(ErrorEnum.InsufficientTokens);
        }
    })
}

/**
 * Verifica che gli utenti specificati all'atto di creazione di una partita non stiano già giocando in un'altra
 * partita, attraverso il metodo del Controller.
 */
 export function checkUsersState(req: any, res: any, next: any) : void {
    Controller.checkIfUsersArePlaying(req.body.game_mode, req.body.email1, req.body.email2, req.body.email3, res).then((check) => {
        if(check) {
            console.log("checkUsersState: SUCCESS");
            next();
        } else {
            console.log("checkUsersState: FAIL");
            next(ErrorEnum.AlreadyPlaying);
        }
    })
}

/**
 * Verifica che l'id specificato (che dev'essere un intero) corrisponda ad una partita esistente nel database.
 */
export function checkGameExistence(req: any, res: any, next: any): void {
    if(Number.isInteger(req.body.id_game)) {
        Controller.checkIfGameExists(req.body.id_game, res).then((check) => {
            if(check) {
                console.log("checkGameExistence: SUCCESS");
                next();
            } else {
                console.log("checkGameExistence: FAIL");
                next(ErrorEnum.NotExistingGame);
            }
        }) 
    } else {
        console.log("checkGameExistence: FAIL");
        next(ErrorEnum.InvalidIdGame);
    }
}

/**
 *  Verifica se la partita specificata è in corso o meno.
 */
export function checkGameState(req: any, res: any, next: any): void {
    Controller.checkIfGameIsInProgress(req.body.id_game, res).then((check) => {
        if(check) {
            console.log("checkGameState: SUCCESS");
            next();
        } else {
            console.log("checkGameState: FAIL");
            next(ErrorEnum.AlreadyFinishedGame);
        }
    })
}

/**
 *  Verifica se è il turno del giocatore che sta tentando di fare una mossa.
 */
 export function checkPlayerTurn(req: any, res: any, next: any): void {
    Controller.checkIfPlayerCanAttack(req.body.id_game, req.body.email, res).then((check) => {
        if(check) {
            console.log("checkPlayerTurn: SUCCESS");
            next();
        } else {
            console.log("checkPlayerTurn: FAIL");
            next(ErrorEnum.NotYourTurn);
        }
    })
}

/**
 * Verifica se una mossa è ammissibile, ossia se si attacca una cella esistente.
 */
export function checkMove1(req: any, res: any, next: any): void {
    Controller.checkIfMoveCanBeDone(req.body.id_game, req.body.x, req.body.y, res).then((check) => {
        if(check) {
            console.log("checkMove1: SUCCESS");
            next();
        } else {
            console.log("checkMove1: FAIL");
            next(ErrorEnum.InvalidMove);
        }
    })
}

/**
 * Verifica se una mossa non sia stata già effettuata. 
 */
 export function checkMove2(req: any, res: any, next: any): void {
    Controller.checkIfMoveIsAlreadyDone(req.body.id_game, req.body.x, req.body.y, res).then((check) => {
        if(check) {
            console.log("checkMove2: SUCCESS");
            next();
        } else {
            console.log("checkMove2: FAIL");
            next(ErrorEnum.AlreadyDoneMove);
        }
    })
}
