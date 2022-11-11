/**
 * Interfaccia ErrorI che definisce i seguenti metodi (che devono essere implementati dalle classi che implementano
 * l'interfaccia):
 * -) getStatus(): restituisce il codice di stato HTTP associato alla risposta;
 * -) getMsg(): restituisce il messaggio di errore associato alla risposta.
 */
interface ErrorI {
    getStatus(): number;
    getMsg(): string;
}

class NoAuthHeaderError implements ErrorI {
    getStatus(): number {
        return 400;
    }
    getMsg(): string {
        return "Bad Request - No authorization header"
    }
}

class NoTokenError implements ErrorI {
    getStatus(): number {
        return 400;
    }
    getMsg(): string {
        return "Bad Request - No JWT";
    }
}

class InvalidTokenError implements ErrorI {
    getStatus(): number {
        return 403;
    }
    getMsg(): string {
        return "Forbidden - Invalid JWT (the key is incorrect)"
    }
}

class InvalidGameModeError implements ErrorI {
    getStatus(): number {
        return 400;
    }
    getMsg(): string {
        return "Bad Request - Game mode must be: 0 (player vs ia), 1 (player vs player) or 2 (player vs player vs player)";
    }
}

class InvalidNumberOfEmailsError implements ErrorI {
    getStatus(): number {
        return 400;
    }
    getMsg(): string {
        return "Bad Request - The emails do not conform to the game mode"
    }
}

class InvalidGridSizeError implements ErrorI {
    getStatus(): number {
        return 400;
    }
    getMsg(): string {
        return "Bad Request - Grid size must be a number between 5 and 15"
    }
}

class InvalidNumberOfShipsError implements ErrorI {
    getStatus(): number {
        return 400;
    }
    getMsg(): string {
        return "Bad Request - Number of ships must be a number between 1 and half the size of the grid"
    }
}

class InvalidMaximumShipSizeError implements ErrorI {
    getStatus(): number {
        return 400;
    }
    getMsg(): string {
        return "Bad Request - Maximum ship size must be a number between 1 and 3"
    }
}

class InternalServerError implements ErrorI {
    getStatus(): number {
        return 500;
    }
    getMsg(): string {
        return "Internal Server Error - Something went wrong with the database";
    }
}

class NotExistingUserError implements ErrorI {
    getStatus(): number {
        return 404;
    }
    getMsg(): string {
        return "Not Found - The given user/users doesn't/don't exist"
    }
}

class MatchingUsersError implements ErrorI {
    getStatus(): number {
        return 400;
    }
    getMsg(): string {
        return "Bad Request - The given user/users must be different"
    }
}

class InsufficientTokensError implements ErrorI {
    getStatus(): number {
        return 401;
    }
    getMsg(): string {
        return "Unauthorized - Insufficient tokens";
    }
}

class AlreadyPlayingError implements ErrorI {
    getStatus(): number {
        return 401;
    }
    getMsg(): string {
        return "Unauthorized - The given user/users is/are already playing in another game"
    }
}

export enum ErrorEnum {
    NoAuthHeader,
    NoToken,
    InvalidToken,
    InvalidGameMode,
    InvalidNumberOfEmails,
    InvalidGridSize,
    InvalidNumberOfShips,
    InvalidMaximumShipSize,
    InternalServer,
    NotExistingUser,
    MatchingUsers,
    InsufficientTokens,
    AlreadyPlaying,
}

/**
 * Classe ErrorFactory che stabilisce, in base al parametro di input type, quale implementazione di ErrorI utilizzare
 * per creare l'oggetto relativo all'errore.
 */
export class ErrorFactory {
    getError(type: ErrorEnum): ErrorI {
        let error: ErrorI;

        switch(type) {
            case(ErrorEnum.NoAuthHeader):
                error = new NoAuthHeaderError();
                break;
            case(ErrorEnum.NoToken):
                error = new NoTokenError();
                break;
            case(ErrorEnum.InvalidToken):
                error = new InvalidTokenError();
                break;
            case(ErrorEnum.InvalidGameMode):
                error = new InvalidGameModeError();
                break;
            case(ErrorEnum.InvalidNumberOfEmails):
                error = new InvalidNumberOfEmailsError();
                break;
            case(ErrorEnum.InvalidGridSize):
                error = new InvalidGridSizeError();
                break;
            case(ErrorEnum.InvalidNumberOfShips):
                error = new InvalidNumberOfShipsError();
                break;
            case(ErrorEnum.InvalidMaximumShipSize):
                error = new InvalidMaximumShipSizeError();
                break;
            case(ErrorEnum.InternalServer):
                error = new InternalServerError();
                break;
            case(ErrorEnum.NotExistingUser):
                error = new NotExistingUserError();
                break;
            case(ErrorEnum.MatchingUsers):
                error = new MatchingUsersError();
                break;
            case(ErrorEnum.InsufficientTokens):
                error = new InsufficientTokensError();
                break;
            case(ErrorEnum.AlreadyPlaying):
                error = new AlreadyPlayingError();
                break;
        }

        return error;
    }
}