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

class MalformedPayloadError implements ErrorI {
    getStatus(): number {
        return 400;
    }
    getMsg(): string {
        return "Bad Request - Malformed payload";
    }
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

export enum ErrorEnum {
    MalformedPayload,
    NoAuthHeader,
    NoToken,
    InvalidToken
}

/**
 * Classe ErrorFactory che stabilisce, in base al parametro di input type, quale implementazione di ErrorI utilizzare
 * per creare l'oggetto relativo all'errore.
 */
export class ErrorFactory {
    getError(type: ErrorEnum): ErrorI {
        let error: ErrorI;

        switch(type) {
            case(ErrorEnum.MalformedPayload):
                error = new MalformedPayloadError();
                break;
            case(ErrorEnum.NoAuthHeader):
                error = new NoAuthHeaderError();
                break;
            case(ErrorEnum.NoToken):
                error = new NoTokenError();
                break;
            case(ErrorEnum.InvalidToken):
                error = new InvalidTokenError();
                break;
        }

        return error;
    }

}