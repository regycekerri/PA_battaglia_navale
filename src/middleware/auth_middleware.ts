require('dotenv').config();
import { ErrorEnum } from "../responses/error";
import * as jwt from 'jsonwebtoken';
import { checkIfAdmin, checkIfUserExists } from "../models/model";

/**
 * Verifica che la richiesta HTTP abbia un Authorization Header.
 */
 export function checkAuthHeader (req: any, res: any, next: any): void {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        next();
    } else {
        next(ErrorEnum.NoAuthHeader);
    }
}

/**
 * Verifica che nell'header sia presente il JWT.
 */
 export function checkToken(req: any, res: any, next: any): void{
    const bearerHeader: string = req.headers.authorization;

    if (typeof bearerHeader !== 'undefined'){
        const bearerToken: string = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    } else {
        next(ErrorEnum.NoToken);
    }
}

/**
 * Verifica che il JWT contenga una chiave che corrisponda alla chiave segreta salvata nel file .env e che il richiedente
 * sia un utente.
 */
 export function verifySecretKey(req: any, res: any, next: any): void{
    try {
        let decoded = jwt.verify(req.token, process.env.SECRET_KEY);
        if (decoded !== null) {
            next();
        } else {
            next(ErrorEnum.InvalidToken);
        }
    } catch (e) { 
        next(ErrorEnum.InvalidToken); 
    }
}

/**
 * Verifica che nel JWT il richiedente sia un utente.
 */
 export async function authenticateUser(req: any, res: any, next: any): Promise<void>{
    try {
        let decoded = JSON.parse(JSON.stringify(jwt.decode(req.token)));
        let authenticated: boolean = await checkIfUserExists(decoded.richiedente);
        if (authenticated) {
            next();
        } else {
            next(ErrorEnum.NotAuthenticated);
        }
    } catch (e) { 
        next(ErrorEnum.InternalServer); 
    }
}

/**
 * Verifica che nel JWT il richiedente sia l'admin.
 */
 export async function authenticateAdmin(req: any, res: any, next: any): Promise<void>{
    try {
        let decoded = JSON.parse(JSON.stringify(jwt.decode(req.token)));
        let authenticated: boolean = await checkIfAdmin(decoded.richiedente);
        if (authenticated) {
            next();
        } else {
            next(ErrorEnum.NotAuthenticated);
        }
    } catch (e) { 
        next(ErrorEnum.InternalServer); 
    }
}