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