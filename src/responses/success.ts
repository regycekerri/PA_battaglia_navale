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

class MoveExecutedSuccess implements SuccessI {
    getStatus(): number {
        return 200;
    }
    getMsg(): string {
        return "Ok - Your Move was executed!";
    }
}

class GameStateShownSuccess implements SuccessI {
    getStatus(): number {
        return 200;
    }
    getMsg(): string {
        return "Ok - The state of the game is shown below!";
    }
}

class GameMovesShownSuccess implements SuccessI {
    getStatus(): number {
        return 200;
    }
    getMsg(): string {
        return "Ok - The moves of the game are shown below!";
    }
}

class PlayerStatsShownSuccess implements SuccessI {
    getStatus(): number {
        return 200;
    }
    getMsg(): string {
        return "Ok - The player's stats are shown below!";
    }
}

class LeaderboardShownSuccess implements SuccessI {
    getStatus(): number {
        return 200;
    }
    getMsg(): string {
        return "Ok - The leaderboard is shown below!";
    }
}

export enum SuccessEnum {
    GameCreated,
    MoveExecuted,
    GameStateShown,
    GameMovesShown,
    PlayerStatsShown,
    LeaderboardShown
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
            case(SuccessEnum.MoveExecuted):
                success = new MoveExecutedSuccess();
                break;
            case(SuccessEnum.GameStateShown):
                success = new GameStateShownSuccess();
                break;
            case(SuccessEnum.GameMovesShown):
                success = new GameMovesShownSuccess();
                break;
            case(SuccessEnum.PlayerStatsShown):
                success = new PlayerStatsShownSuccess();
                break;
            case(SuccessEnum.LeaderboardShown):
                success = new LeaderboardShownSuccess();
                break;
        }

        return success;
    }
}