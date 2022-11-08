import * as express from 'express';
import { ErrorEnum, ErrorFactory } from './errors/error';
import * as AuthMiddleware from './middleware/auth_middleware';
import * as RouteMiddleware from './middleware/route_middleware';
import * as ControllerMiddleware from './middleware/controller_middleware';
import * as ErrorHandlerMiddleware from './middleware/error_handling_middleware';

const app = express();

app.use(express.json());

app.use((err: Error, req: any, res: any, next: any) => {
    if (err instanceof SyntaxError) {
        const errorFactory = new ErrorFactory();
        const error = errorFactory.getError(ErrorEnum.MalformedPayload);
        res.status(error.getStatus()).json(error.getMsg());
    }
    next();
});

/**
 * Rotta di tipo POST che consente di creare una partita tramite token JWT.
 */
app.post('/create_game',
    AuthMiddleware.checkAuthHeader,
    AuthMiddleware.checkToken,
    AuthMiddleware.verifyAndAuthenticate,
    RouteMiddleware.checkCreateGamePayload,
    RouteMiddleware.checkGameMode,
    RouteMiddleware.checkNumberOfEmails,
    RouteMiddleware.checkGridSize,
    RouteMiddleware.checkNumberOfShips,
    RouteMiddleware.checkMaximumShipSize,
    ControllerMiddleware.checkUsersExistence,
    ControllerMiddleware.checkUsersTokens,
    ControllerMiddleware.checkUsersState,
    ErrorHandlerMiddleware.errorHandler,
    (req: any, res: any) => {
        Controller.createGame(req.body, res);
    }
);

app.listen(8080);