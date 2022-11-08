import { User } from './orm';

/**
 * Funzione che verifica l'esistenza di un utente nel database, data la sua email.
 */
 export async function checkIfUserExists(email: string): Promise<any> {
    let check: any = await User.findByPk(email, {raw: true});
    return check;
}

/**
 * Funzione che restituisce i token appartenenti ad un utente, data la sua email.
 */
export async function getUserTokens(email: string): Promise<number> {
    let user: any = await User.findByPk(email, {raw: true});
    return user.token;
}

/**
 * Funzione che verifica che un utente sta giocando o meno.
 */
export async function isUserPlaying(email: string): Promise<boolean> {
    let user: any = await User.findByPk(email, {raw: true});
    return user.playing;
}