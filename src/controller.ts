import { ErrorEnum, ErrorFactory } from "./responses/error";
import * as Model from "./models/model";
import { SuccessEnum, SuccessFactory } from "./responses/success";

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
                await Model .decreaseTokens(email3, 0.4);
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
         })
        } else {
            throw new Error();
        }
    } catch(error) {
        generateControllerErrors(ErrorEnum.InternalServer, error, res);
    }
}

/**
 * Funzione invocata dai metodi del Controller in caso di errori che sfrutta la ErrorFactory per generare gli errori da
 * restituire al client nella risposta.
 */
 function generateControllerErrors(error_enum: ErrorEnum, err: Error, res: any) {
    const errorFactory = new ErrorFactory();
    const error = errorFactory.getError(error_enum);
    res.status(error.getStatus()).json(error.getMsg());
}