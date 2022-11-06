import * as express from 'express';
import { ErrorEnum, ErrorFactory } from './errors/error';

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
 * app.post('/create-event', Middleware.JWT , Middleware.create_event, Middleware.error_handling, function (req: any, res: any) {    
    Controller.createEvent(req.body, res);
});
 */
app.post('/create_game');

app.listen(8080);