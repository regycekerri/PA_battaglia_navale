import * as express from 'express';
import { ErrorEnum, ErrorFactory } from './errors/error';
import * as AuthMiddleware from './middleware/auth_middleware';
import * as RouteMiddleware from './middleware/route_middleware';
import * as ControllerMiddleware from './middleware/controller_middleware';

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
 * 
 * ESEMPIO DA SEGUIRE:
 * app.post('/create-event', Middleware.create_event, Middleware.error_handling, function (req: any, res: any) {    
    Controller.createEvent(req.body, res);
});
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
);

export const create_event = [
    RouteMiddleware.checkUserExistence,
    RouteMiddleware.checkDatetimes,
    RouteMiddleware.checkUserBalance
];

app.listen(8080);