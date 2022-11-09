/**
 * Interfaccia SuccessI che definisce i seguenti metodi (che devono essere implementati dalle classi che implementano
 * l'interfaccia):
 * -) getStatus(): restituisce il codice di stato HTTP associato alla risposta;
 * -) getMsg(): restituisce il messaggio da inserire nella risposta.
 */
 interface SuccessI {
    getStatus(): number;
    getMsg(): string;
}

class GameCreatedSuccess implements SuccessI {
    getStatus(): number {
        return 201;
    }
    getMsg(): string {
        return "Created - Game created successfully!";
    }
}

export enum SuccessEnum {
    GameCreated
}

/**
 * Classe SuccessFactory che stabilisce, in base al parametro di input type, quale implementazione di SuccessI 
 * utilizzare per creare l'oggetto indicante il successo della richiesta.
 */
export class SuccessFactory {
    getSuccess(type: SuccessEnum): SuccessI {
        let success: SuccessI;

        switch(type) {
            case(SuccessEnum.GameCreated):
                success = new GameCreatedSuccess();
                break;
        }

        return success;
    }
}