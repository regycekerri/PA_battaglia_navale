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

/**
 * Verifica che nella richiesta di consultazione delle mosse di una determinata partita il parametro csv sia booleano.
 */
 export function checkCSV(req: any, res: any, next: any): void {
    if(typeof req.body.csv === 'boolean') {
        console.log("checkCSV: SUCCESS");
        next();
    } else {
        console.log("checkCSV: FAIL");
        next(ErrorEnum.InvalidCSV);
    }
}

/**
 * Verifica che la richiesta di consultazione delle statistiche di un giocatore contenga dei parametri formalmente 
 * corretti. 
 */
 export function checkPlayerStatsPayload(req: any, res: any, next: any): void {
    if(typeof req.body.email === 'string' && req.body.email !== null && req.body.email !== "") {
        console.log("checkEmail: SUCCESS");

        let data_inizio: string = req.body.data_inizio;
        let data_fine: string = req.body.data_fine;

        if(isValidDate(data_inizio) && isValidDate(data_fine)) {
            let d1: Date = new Date(data_inizio);
            let d2: Date = new Date(data_fine);

            if(d2 >= d1) {
                console.log("checkDates: SUCCESS");
                next();
            } else {
                console.log("checkDate: FAIL");
                next(ErrorEnum.InvalidDates);
            }
        } else {
            console.log("checkDates: FAIL");
            next(ErrorEnum.InvalidDates);
        }

    } else {
        console.log("checkEmail: FAIL");
        next(ErrorEnum.InvalidEmail);
    }
}

/**
 * Funzione che verifica se una data è valida o meno (deve essere nel formato YYYY-MM-DD).
 */
function isValidDate(date: string): boolean {
    let parts: string[] = date.split('-');
    let day: number = parseInt(parts[2]);
    let month: number = parseInt(parts[1]);
    let year: number = parseInt(parts[0]);

    if(year < 2021 || year > 2100 || month <= 0 || month > 12) {
        return false;
    }

    let monthlengths: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
        monthlengths[1] = 29;
    }

    return day > 0 && day <= monthlengths[month - 1];
}