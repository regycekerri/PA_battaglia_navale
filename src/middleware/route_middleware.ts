import { ErrorEnum } from "../responses/error";

/**
 * Verifica che la richiesta di creazione di una partita sia strutturata correttamente.
 * In particolare: 
 * -) game_mode, grid_size, number_of_ships e maximum_ship_size devono essere dei numeri; 
 * -) email1, email2 ed email3 devono essere delle stringhe.
 */
export function checkCreateGamePayload(req: any, res: any, next: any): void {
    if(((typeof req.body.game_mode === 'number') && (Number.isInteger(req.body.game_mode))) 
       && ((typeof req.body.grid_size === 'number') && (Number.isInteger(req.body.grid_size))) 
       && ((typeof req.body.number_of_ships === 'number') && (Number.isInteger(req.body.number_of_ships)))
       && ((typeof req.body.maximum_ship_size === 'number') && (Number.isInteger(req.body.maximum_ship_size)))
       && (typeof req.body.email1 === 'string')
       && (typeof req.body.email2 === 'string')
       && (typeof req.body.email3 === 'string')) {
        next();
       } else {
        next(ErrorEnum.MalformedPayload);
       }
}

/**
 * Verifica che la richiesta di creazione di una partita contenga una tipologia di partita ammissibile (0, 1 o 2).
 */
export function checkGameMode(req: any, res: any, next: any): void {
    if([0, 1, 2].includes(req.body.game_mode)) {
        next();
    } else {
        next(ErrorEnum.InvalidGameMode);
    }
}

/**
 * Verifica che la richiesta di creazione di una partita contenga delle email conformi alla tipologia di partita
 * specificata.
 */
export function checkNumberOfEmails(req: any, res: any, next: any): void {
    if(req.body.game_mode === 0) {
        if(((req.body.email1 !== null) || (req.body.email1 !== ""))
            && ((req.body.email2 === null) || (req.body.email2 === ""))
            && ((req.body.email3 === null) || (req.body.email3 === ""))) {
                next();
        }
    }

    if(req.body.game_mode === 1) {
        if(((req.body.email1 !== null) || (req.body.email1 !== ""))
            && ((req.body.email2 !== null) || (req.body.email2 !== ""))
            && ((req.body.email3 === null) || (req.body.email3 === ""))) {
                next();
        }
    }

    if(req.body.game_mode === 2) {
        if(((req.body.email1 !== null) || (req.body.email1 !== ""))
            && ((req.body.email2 !== null) || (req.body.email2 !== ""))
            && ((req.body.email3 !== null) || (req.body.email3 !== ""))) {
                next();
        }
    }

    next(ErrorEnum.InvalidNumberOfEmails);
}

/**
 * Verifica che la richiesta di creazione di una partita contenga una dimensione della griglia ammissibile (da 5 a 15).
 */
 export function checkGridSize(req: any, res: any, next: any): void {
    if([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].includes(req.body.grid_size)) {
        next();
    } else {
        next(ErrorEnum.InvalidGridSize);
    }
}

/**
 * Verifica che la richiesta di creazione di una partita contenga un numero di navi ammissibile (da 1 alla dimensione
 * della griglia/2).
 */
export function checkNumberOfShips(req: any, res: any, next: any): void {
    let grid_size = req.body.grid_size;
    let number_of_ships = req.body.number_of_ships;
    let limit = (grid_size % 2 === 0) ? grid_size/2 : grid_size/2 + 0.5;

    if((number_of_ships >= 1) && (number_of_ships <= limit)) {
        next();
    } else {
        next(ErrorEnum.InvalidNumberOfShips);
    }
}

/**
 * Verifica che la richiesta di creazione di una partita contenga una dimensione massima delle navi compresa tra 1 e 3. 
 */
export function checkMaximumShipSize(req: any, res: any, next: any): void {
    if([1, 2, 3].includes(req.body.maximum_ship_size)) {
        next();
    } else {
        next(ErrorEnum.InvalidMaximumShipSize);
    }
}