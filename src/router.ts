import * as express from 'express';
import * as AuthMiddleware from './middleware/auth_middleware';
import * as RouteMiddleware from './middleware/route_middleware';
import * as ControllerMiddleware from './middleware/controller_middleware';
import * as ErrorHandlerMiddleware from './middleware/error_handling_middleware';
import * as Controller from './controller';
import { getGameById } from './models/model';
import * as jwt from 'jsonwebtoken';

const app = express();

app.use(express.json());

/**
 * Rotta di tipo POST che consente di creare una partita tramite token JWT.
 */
app.post('/create_game',
    AuthMiddleware.checkAuthHeader,
    AuthMiddleware.checkToken,
    AuthMiddleware.verifySecretKey,
    AuthMiddleware.authenticateUser,
    (req: any, res: any, next: any) => {
        //Aggiorno il body
        let decoded = JSON.parse(JSON.stringify(jwt.decode(req.token)));
        req.body.email1 = decoded.richiedente;
        next();
    },
    RouteMiddleware.checkGameMode,
    RouteMiddleware.checkEmails,
    RouteMiddleware.checkGridSize,
    RouteMiddleware.checkNumberOfShips,
    RouteMiddleware.checkMaximumShipSize,
    ControllerMiddleware.checkUsersExistence,
    ControllerMiddleware.checkUsersTokens,
    ControllerMiddleware.checkUsersState,
    ErrorHandlerMiddleware.errorHandler,
    (req: any, res: any) => {
        Controller.createGame(req.body, res).then(() => {
            console.log("Partita creata!");
        })
    }
);

/**
 * Rotta di tipo POST che consente di effettuare una mossa in un partita, verificando se è ammissibile o meno.
 */
app.post('/make_move', 
    AuthMiddleware.checkAuthHeader, 
    AuthMiddleware.checkToken, 
    AuthMiddleware.verifySecretKey,
    AuthMiddleware.authenticateUser,
    (req: any, res: any, next: any) => {
        //Aggiorno il body
        let decoded = JSON.parse(JSON.stringify(jwt.decode(req.token)));
        req.body.email = decoded.richiedente;
        next();
    },
    ControllerMiddleware.checkGameExistencePOST,
    ControllerMiddleware.checkGameState,
    ControllerMiddleware.checkPlayerTurn,
    RouteMiddleware.checkXAndY,
    ControllerMiddleware.checkMove1,
    ControllerMiddleware.checkMove2,
    ErrorHandlerMiddleware.errorHandler,
    (req: any, res: any) => {
        getGameById(req.body.id_game).then((game) => {
            if(game.ia) {
                //Partita contro ia
                console.log("Mossa contro ia eseguita");
                Controller.makeMoveVsIA(req.body, game, res);
            } else if(game.player3 === null) {
                //Partita tra due giocatori
                console.log("Mossa contro giocatore eseguita");
                Controller.makeMoveVsPlayer(req.body, game, res);
            } else {
                //Partita tra tre giocatori
                console.log("Mossa contro uno di due giocatori eseguita");
                Controller.makeMoveVsPlayers(req.body, game, res);
            }
        });
    }
);

/**
 * Rotta di tipo GET che consente di visualizzare lo stato di una partita.
 */
app.get('/game_state/:id_game',
    AuthMiddleware.checkAuthHeader,
    AuthMiddleware.checkToken,
    AuthMiddleware.verifySecretKey,
    AuthMiddleware.authenticateUser,
    ControllerMiddleware.checkGameExistenceGET,
    ErrorHandlerMiddleware.errorHandler,
    (req: any, res: any) => {
        Controller.showGameState(req.params, res).then(() => {
            console.log("Stato della partita restituito");
        });
    }
);

/**
 * Rotta di tipo GET che consente di visualizzare le mosse effettuate in una determinata partita.
 */
app.get('/game_moves/:id_game/', 
    AuthMiddleware.checkAuthHeader,
    AuthMiddleware.checkToken,
    AuthMiddleware.verifySecretKey,
    AuthMiddleware.authenticateUser,
    RouteMiddleware.checkCSV,
    ControllerMiddleware.checkGameExistenceGET,
    ErrorHandlerMiddleware.errorHandler,
    (req: any, res: any) => {
        Controller.showGameMoves(req, res).then(() => {
            console.log("Elenco delle mosse della partita restituito");
        })
    }
);

/**
 * Rotta di tipo GET che consente di visualizzare le statistiche di un determinato giocatore.
 */
app.get('/player_stats/:email/', 
    AuthMiddleware.checkAuthHeader,
    AuthMiddleware.checkToken,
    AuthMiddleware.verifySecretKey,
    AuthMiddleware.authenticateUser,
    RouteMiddleware.checkPlayerStatsParams,
    ControllerMiddleware.checkPlayerExistence,
    ErrorHandlerMiddleware.errorHandler,
    (req: any, res: any) => {
        Controller.showPlayerStats(req, res).then(() => {
        console.log("Statistiche del giocatore restituite");
        })
    }
);

/**
 * Rotta di tipo GET che consente di visualizzare la classifica dei giocatori (nell'ordine desiderato).
 */
app.get('/leaderboard', 
    RouteMiddleware.checkOrder,
    RouteMiddleware.checkBy,
    ErrorHandlerMiddleware.errorHandler,
    (req: any, res: any) => {
        Controller.showLeaderBoard(req.query, res).then(() => {
        console.log("Classifica dei giocatori restituita.");
        })
    }
);

/**
 * Rotta di tipo POST (accessibile soltanto dall'admin) che consente di ricaricare i token di un determinato utente.
 */
app.post('/refill_tokens',
    AuthMiddleware.checkAuthHeader,
    AuthMiddleware.checkToken,
    AuthMiddleware.verifySecretKey,
    AuthMiddleware.authenticateAdmin,
    ControllerMiddleware.checkUserExistence,
    RouteMiddleware.checkTokens,
    ErrorHandlerMiddleware.errorHandler,
    (req: any, res: any) => {
        Controller.refillTokens(req, res).then(() => {
            console.log("Ricarica dei token effettuata con successo");
        })
    }
);

/** 
 * Gestione delle rotte non previste
 */ 
app.get('*',
(req: any, res: any) => {
    res.status(404).json({"status": 404, "error": "Not Found - This route doesn't exist"});
});

app.post('*',
(req: any, res: any) => {
    res.status(404).json({"status": 404, "error": "Not Found - This route doesn't exist"});
});

app.listen(8080);