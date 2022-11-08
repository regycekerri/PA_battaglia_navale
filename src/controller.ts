import { ErrorEnum, ErrorFactory } from "./errors/error";
import * as Model from "./models/model";

/**
 * Funzione che verifica se gli utenti specificati all'atto di creazione di una partita esistono o meno.
 */
 export async function checkIfUsersExist(game_mode: number, email1: string, email2: string, email3: string, res: any): Promise<boolean> {
    let check1: any;
    let check2: any;
    let check3: any;
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
 * Funzione che verifica se gli utenti specificati all'atto di creazione di una partita esistono o meno.
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
 * Funzione invocata dai metodi del Controller in caso di errori che sfrutta la ErrorFactory per generare gli errori da
 * restituire al client nella risposta.
 */
 function generateControllerErrors(error_enum: ErrorEnum, err: Error, res: any) {
    const errorFactory = new ErrorFactory();
    const error = errorFactory.getError(error_enum);
    res.status(error.getStatus()).json(error.getMsg());
}