import { ErrorEnum } from "../responses/error";

/**
 * Verifica che la richiesta di creazione di una partita contenga una tipologia di partita ammissibile (0, 1 o 2).
 */
export function checkGameMode(req: any, res: any, next: any): void {
    if([0, 1, 2].includes(req.body.game_mode)) {
        console.log("checkGameMode: SUCCESS");
        next();
    } else {
        console.log("checkGameMode: FAIL");
        next(ErrorEnum.InvalidGameMode);
    }
}

/**
 * Verifica che la richiesta di creazione di una partita contenga delle email (che devono essere delle stringhe) 
 * conformi alla tipologia di partita specificata.
 */
export function checkEmails(req: any, res: any, next: any): void {
    if(req.body.game_mode === 0) {
        if(
            (typeof req.body.email1 === 'string' && (req.body.email1 !== null) && (req.body.email1 !== ""))
            && ((req.body.email2 === null) || (req.body.email2 === ""))
            && ((req.body.email3 === null) || (req.body.email3 === ""))
        ) {
            console.log("checkEmails: SUCCESS");
            next();
        } else {
            console.log("checkEmails: FAIL");
            next(ErrorEnum.InvalidNumberOfEmails);
        }
    } else if(req.body.game_mode === 1) {
        if(
            (typeof req.body.email1 === 'string' && (req.body.email1 !== null) && (req.body.email1 !== ""))
            && (typeof req.body.email2 === 'string' && (req.body.email2 !== null) && (req.body.email2 !== ""))
            && ((req.body.email3 === null) || (req.body.email3 === ""))
        ) {
            console.log("checkEmails: SUCCESS");
            next();
        } else {
            console.log("checkEmails: FAIL");
            next(ErrorEnum.InvalidNumberOfEmails);
        }
    } else if(req.body.game_mode === 2) {
        if(
            (typeof req.body.email1 === 'string' && (req.body.email1 !== null) && (req.body.email1 !== ""))
            && (typeof req.body.email2 === 'string' && (req.body.email2 !== null) && (req.body.email2 !== ""))
            && (typeof req.body.email3 === 'string' && (req.body.email3 !== null) && (req.body.email3 !== ""))
        ) {
            console.log("checkEmails: SUCCESS");
            next();
        } else {
            console.log("checkEmails: FAIL");
            next(ErrorEnum.InvalidNumberOfEmails);
        }
    }
}

/**
 * Verifica che la richiesta di creazione di una partita contenga una dimensione della griglia ammissibile (da 3 a 8).
 */
 export function checkGridSize(req: any, res: any, next: any): void {
    if([3, 4, 5, 6, 7, 8].includes(req.body.grid_size)) {
        console.log("checkGridSize: SUCCESS");
        next();
    } else {
        console.log("checkGridSize: FAIL");
        next(ErrorEnum.InvalidGridSize);
    }
}

/**
 * Verifica che la richiesta di creazione di una partita contenga un numero di navi ammissibile (da 1 alla dimensione
 * della griglia/2).
 */
export function checkNumberOfShips(req: any, res: any, next: any): void {
    if(Number.isInteger(req.body.number_of_ships)) {
        let grid_size = req.body.grid_size;
        let number_of_ships = req.body.number_of_ships;
        let limit = (grid_size % 2 === 0) ? grid_size/2 : grid_size/2 + 0.5;

        if((number_of_ships >= 1) && (number_of_ships <= limit)) {
            console.log("checkNumberOfShips: SUCCESS");
            next();
        } else {
            console.log("checkNumberOfShips: FAIL");
            next(ErrorEnum.InvalidNumberOfShips);
        }
    }
}

/**
 * Verifica che la richiesta di creazione di una partita contenga una dimensione massima delle navi compresa tra 1 e 3. 
 */
export function checkMaximumShipSize(req: any, res: any, next: any): void {
    if([1, 2, 3].includes(req.body.maximum_ship_size)) {
        console.log("checkMaximumShipSize: SUCCESS");
        next();
    } else {
        console.log("checkMaximumShipSize: FAIL");
        next(ErrorEnum.InvalidMaximumShipSize);
    }
}

/**
 * Verifica che nella richiesta di effettuazione di una mossa i parametri x e y passati siano effettivamente degli
 * interi;
 */
 export function checkXAndY(req: any, res: any, next: any): void {
    if(Number.isInteger(req.body.x) && Number.isInteger(req.body.y)) {
        console.log("checkXAndY: SUCCESS");
        next();
    } else {
        console.log("checkXAndY: FAIL");
        next(ErrorEnum.InvalidXAndY);
    }
}