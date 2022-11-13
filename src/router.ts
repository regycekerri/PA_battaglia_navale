import * as express from 'express';
import * as AuthMiddleware from './middleware/auth_middleware';
import * as RouteMiddleware from './middleware/route_middleware';
import * as ControllerMiddleware from './middleware/controller_middleware';
import * as ErrorHandlerMiddleware from './middleware/error_handling_middleware';
import * as Controller from './controller';
import { getGameById } from './models/model';

const app = express();

app.use(express.json());

/**
 * Rotta di tipo POST che consente di creare una partita tramite token JWT.
 */
app.post('/create_game',
    AuthMiddleware.checkAuthHeader,
    AuthMiddleware.checkToken,
    AuthMiddleware.verifyAndAuthenticate,
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
    AuthMiddleware.verifyAndAuthenticate,
    ControllerMiddleware.checkGameExistence,
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

app.listen(8080);