/**
 * Funzione che restituisce un numero casuale compreso tra un valore minimo e un valore massimo (inclusi).
 */
export function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}