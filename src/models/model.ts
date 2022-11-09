import { User, Game } from './orm';

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

/**
 * Funzione che crea una partita secondo le specifiche fornite. 
 * 
 * Specifiche: grid_size (number), number_of_ships (number), maximum_ship_size (number).
 */
export async function createGame(body: any): Promise<any> {
    const game_mode: number = body.game_mode;
    const email1: string = body.email1;
    const email2: string = body.email2;
    const email3: string = body.email3;

    //Da sistemare
    let grid_player1: any;

    let today_date: Date = new Date();

    if(game_mode === 0){
        //Da sistemare
        let grid_IA: any;

        Game.create({
            player1: email1,
            player2: null,
            player3: null,
            ia: true,
            grid1: grid_player1,
            grid2: null,
            grid3: null,
            gridIA: grid_IA,
            attaccante: email1,
            difensore: "ia",
            in_progress: true,
            vincitore: null,
            perdente1: null,
            perdente2: null,
            start_date: today_date.toISOString().slice(0, 10),
            end_date: null
        });
    } else if(game_mode === 1) {
        //Da sistemare
        let grid_player2: any;

        Game.create({
            player1: email1,
            player2: email2,
            player3: null,
            ia: false,
            grid1: grid_player1,
            grid2: grid_player2,
            grid3: null,
            gridIA: null,
            attaccante: email1,
            difensore: email2,
            in_progress: true,
            vincitore: null,
            perdente1: null,
            perdente2: null,
            start_date: today_date.toISOString().slice(0, 10),
            end_date: null
        });
    } else {
        //Da sistemare
        let grid_player2: any;
        let grid_player3: any;

        return Game.create({
            player1: email1,
            player2: email2,
            player3: email3,
            ia: false,
            grid1: grid_player1,
            grid2: grid_player2,
            grid3: grid_player3,
            gridIA: null,
            attaccante: email1,
            difensore: email2,
            in_progress: true,
            vincitore: null,
            perdente1: null,
            perdente2: null,
            start_date: today_date.toISOString().slice(0, 10),
            end_date: null
        });
    }
}

/**
 * Funzione che decrementa i token dell'utente della quantità specificata.
 */
 export async function decreaseTokens(email: string, payment: number): Promise<any> {
    let user: any = await User.findByPk(email, {raw: true});
    user.token = user.token - payment;
    await user.save();
}