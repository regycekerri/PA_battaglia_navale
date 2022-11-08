import * as Controller from "../controller";
import { ErrorEnum } from "../errors/error";

/**
 * Verifica che gli utenti specificati all'atto di creazione di una partita esistano effettivamente nel database, 
 * attraverso il metodo del Controller.
 */
 export function checkUsersExistence(req: any, res: any, next: any) : void {
    Controller.checkIfUsersExist(req.body.game_mode, req.body.email1, req.body.email2, req.body.email3, res).then((check) => {
        if(check) {
            next();
        } else {
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
            next();
        } else {
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
            next();
        } else {
            next(ErrorEnum.AlreadyPlaying);
        }
    })
}