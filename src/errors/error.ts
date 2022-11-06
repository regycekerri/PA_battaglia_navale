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

export enum ErrorEnum {
    MalformedPayload
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
        }

        return error;
    }

}