# *Battaglia Navale*
![alt text](http://ar-entertainment.net/wp/wp-content/uploads/2019/01/Simulator-Screen-Shot-iPad-Pro-12.9-inch-2nd-generation-2018-11-21-at-10.16.51.png)
# Indice
1. [Introduzione](#introduzione)
2. [Avvio tramite docker](#docker)
3. [Richieste](#rotte)
    1. [create_game](#creategame)
    2. [make_move](#makemove)
    3. [game_state](#gamestate)
    4. [game_moves](#gamemoves)
    5. [player_stats](#stats)
    6. [leaderboard](#classifica)
    7. [refill_tokens](#ricarica)
    8. [Collection](#collection)
4. [Diagrammi UML](#diagrammi)
    1. [Use Case Diagram](#casi)
    2. [Interaction Overview Diagram](#interaction)
    3. [Sequence Diagram](#sequenze)
5. [Pattern utilizzati](#pattern)
    1. [Chain of Responsability](#cor)
    2. [Factory](#factory)
    3. [Singleton](#singleton)
    4. [Builder](#builder)

6. [Software utilizzati](#software)
7. [Autori](#autori)

## Introduzione <a name="introduzione"></a>

L'obbiettivo del progetto è realizzare un sistema che consenta di gestire il gioco della battaglia navale. 

In particolare, il sistema deve prevedere la possibilità di far interagire 2 o 3 utenti oppure un utente contro l'elaboratore.

Gli utenti per poter partecipare ad una partita devono autentificarsi tramite [JWT](https://jwt.io) e devono avere almeno 0.40 token. Ad ogni mossa di un giocatore vengono addebitati 0.10 token a ciascuno. Tuttavia, durante una partita, anche se il credito (valore iniziale impostato nel seed del database) scende sotto lo zero si può continuare a giocare.

Ci possono essere più partite attive nello stesso momento ma un utente può partecipare ad una ed una sola partita.

***

## Avvio tramite Docker <a name="docker"></a>

L'avvio del sistema prevede l'utilizzo di [docker](https://www.docker.com/products/docker-desktop/) e un API testing come ad esempio [postman](https://www.postman.com/downloads/) per effetture le chiamate al fine di testare il progetto.

Il sistema si può avviare tramite docker-compose dopo aver fatto la clone dell'attuale [repository](https://github.com/regycekerri/PA_battaglia_navale) sulla macchina locale.

Dopo aver fatto ciò, tramite il prompt dei comandi, bisogna entrare nella cartella tramite il comando ```cd directory_della_repository``` e poi avviare docker tramite ```docker-compose up``` .

Il client si interfaccerà con il servizio tramite postman che sarà in ascolto sulla porta 8080 di un webserver generato da Docker, il quale comporrà due container, rispettivamente eseguiti a partire da un'immagine Node.js e da un'immagine MySQL.

Prima di avviare il servizio è necessario memorizzarare la chiava privata da usare lato back-end in un file ```.env``` all'interno della cartella della repository.

***

## Richieste <a name="rotte"></a>

Le richieste elencate di seguito possono essere testate attraverso ```http://localhost:8080/nome_della_richiesta``` .

| Tipo         | Rotte         | Descrizione   | JWT |
| ------------ |---------------|---------------|---------|
|   ```POST``` | /create_game  | Richiesta che permette di creare una partita| SI |
|   ```POST``` | /make_move    | Richiesta che consente di effettuare una mossa| SI |
|   ```GET```  | /game_state   | Richiesta che consente di valutare lo stato di una partita| SI |
|   ```GET```  | /game_moves   | Richiesta che restituisce lo storico delle mosse di una data partita con la possibilità di esportare in CSV| SI |
|   ```GET```  | /player_stats | Richiesta che restituisce le statistiche di un utente con la possibilità di filtrare per date| SI |
|   ```GET```  | /leaderboard  | Richiesta che restituisce la classifica dei giocatori| NO |
|   ```POST``` | /refill_tokens| Richiesta che consente all'utente con ruolo admin di effettuare la ricarica dei token di un utente| SI |

***
### create_game <a name="creategame"></a>

Il token JWT, che deve contenere al suo interno la SECRET_KEY corretta, deve includere un payload con la seguente struttura:
```
{
  "richiedente": "regy.cekerri@gmail.com"
}
```
Il richiedente, se non riconosciuto dall'applicazione, non viene autenticato e non può quindi creare la partita.

Il body deve possedere la seguente struttura, in cui il richiedente corrisponde alla email1:
```
{
  "game_mode": 1,
  "grid_size": 5,
  "number_of_ships": 1,
  "maximum_ship_size": 2,
  "email2": "davide.malatesta@gmail.com",
  "email3": ""
}
```
Per quanto riguarda i parametri: 
* la modalità di gioco deve essere un numero compreso tra 0 (giocatore vs IA), 1 (giocatore vs giocatore) e 2 (giocatore vs giocatore vs giocatore);
* in relazione alla modalità di gioco devono essere inserite delle email appropiate (nel numero giusto);
* la dimensione della griglia deve essere compresa tra 3x3 e 8x8;
* il numero delle navi deve essere compreso tra 1 e la metà della dimensione della griglia (es. una griglia 4x4 può avere al massimo 2 navi);
* la dimensione massima delle navi deve essere compresa tra 1 e 3.

Inoltre, devono essere rispettati i seguenti vincoli:
* le email specificate non devono coincidere;
* gli utenti specificati devono esistere;
* tutti i giocatori devono possedere almeno 0,40 token all'atto di creazione della partita;
* un giocatore può giocare al massimo ad una partita per volta.

In caso di richiesta andata a buon fine si ottiene una risposta della seguente tipologia:
```
{
  "message": "Created - Game created successfully!,
  "id_game": 8,
  "player1": "regy.cekerri@gmail.com",
  "player2": "davide.malatesta99@gmail.com",
  "player3": "",
  "ia": false
}
```
***
### make_move <a name="makemove"></a>

Il token JWT, che deve contenere al suo interno la SECRET_KEY corretta, deve includere un payload con la seguente struttura:
```
{
  "richiedente": "horatio.nelson@gmail.com"
}
```
Il richiedente, se non riconosciuto dall'applicazione, non viene autenticato e non può effettuare la mossa.

Il body deve possedere la seguente struttura, in cui il richiedente corrisponde alla email dell'attaccante:
```
{
    "id_game": 5,
    "x": 1,
    "y": 2
}
```
Per quanto riguarda i parametri: 
* l'id della partita deve essere un numero intero;
* x e y corrispondono rispettivamente alla riga e alla colonna della cella da attaccare;

Inoltre, devono essere rispettati i seguenti vincoli:
* l'id della partita deve corrispondere ad una partita effettivamente esistente e ancora in corso;
* il richiedente può attaccare soltanto se è il suo turno;
* la cella da attaccare deve esistere e non deve essere già stata attaccata;

In caso di richiesta andata a buon fine si ottiene una risposta della seguente tipologia:
```
{
    "message": "Ok - Your Move was executed!",
    "attaccante": "horatio.nelson@gmail.com",
    "difensore": "ia",
    "esito": "Complimenti, hai vinto!"
}
```
***
### game_state <a name="gamestate"></a>

Il token JWT, che deve contenere al suo interno la SECRET_KEY corretta, deve includere un payload con la seguente struttura:
```
{
  "richiedente": "davide.malatesta@gmail.com"
}
```
Il richiedente, se non riconosciuto dall'applicazione, non viene autenticato e non può visualizzare lo stato della partita.

Per quanto riguarda i parametri, l'id della partita deve essere un numero intero e deve corrispondere ad una partita esistente (terminata o in corso).

In caso di richiesta andata a buon fine si ottiene una risposta della seguente tipologia:
```
{
    "message": "Ok - The state of the game is shown below!",
    "id": 6,
    "player1": "davide.malatesta@gmail.com",
    "player2": "regy.cekerri@gmail.com",
    "player3": null,
    "ia": false,
    "grid1": {
        "grid": [
            [
                {
                    "type": 0,
                    "attacked": false
                },
                {
                    "type": 0,
                    "attacked": false
                },
                {
                    "type": 0,
                    "attacked": false
                }
            ],
            [
                {
                    "type": 0,
                    "attacked": false
                },
                {
                    "type": 0,
                    "attacked": false
                },
                {
                    "type": 0,
                    "attacked": true
                }
            ],
            [
                {
                    "type": 0,
                    "attacked": true
                },
                {
                    "type": 0,
                    "attacked": false
                },
                {
                    "type": 0,
                    "attacked": false
                }
            ]
        ]
    },
    "grid2": {
        "grid": [
            [
                {
                    "type": 1,
                    "attacked": false
                },
                {
                    "type": 0,
                    "attacked": false
                },
                {
                    "type": 0,
                    "attacked": false
                }
            ],
            [
                {
                    "type": 0,
                    "attacked": false
                },
                {
                    "type": 0,
                    "attacked": false
                },
                {
                    "type": 0,
                    "attacked": false
                }
            ],
            [
                {
                    "type": 0,
                    "attacked": false
                },
                {
                    "type": 0,
                    "attacked": true
                },
                {
                    "type": 1,
                    "attacked": false
                }
            ]
        ]
    },
    "grid3": null,
    "gridIA": null,
    "attaccante": null,
    "difensore": null,
    "in_progress": false,
    "vincitore": "davide.malatesta@gmail.com",
    "perdente1": "regy.cekerri@gmail.com",
    "perdente2": null,
    "start_date": "2022-11-14",
    "end_date": "2022-11-14"
}
```
***

### game_moves <a name="gamemoves"></a>

Il token JWT, che deve contenere al suo interno la SECRET_KEY corretta, deve includere un payload con la seguente struttura:
```
{
  "richiedente": "horatio.nelson@gmail.com"
}
```
Il richiedente, se non riconosciuto dall'applicazione, non viene autenticato e non può visualizzare le mosse della partita.

Per quanto riguarda i parametri, l'id della partita deve essere un numero intero e deve corrispondere ad una partita esistente (terminata o in corso), mentre csv specifica attraverso un valore booleano se si vogliono esportare o meno le mosse in un file ```.csv```.

In caso di richiesta andata a buon fine si ottiene una risposta della seguente tipologia:
```
{
    "message": "Ok - The moves of the game are shown below!",
    "id_game": "3",
    "moves": [
        {
            "id": 33,
            "id_game": 3,
            "attaccante": "horatio.nelson@gmail.com",
            "difensore": "ia",
            "x": 1,
            "y": 1,
            "colpita_nave": false
        },
        {
            "id": 34,
            "id_game": 3,
            "attaccante": "ia",
            "difensore": "horatio.nelson@gmail.com",
            "x": 1,
            "y": 2,
            "colpita_nave": false
        }
    ]
}
```
Nel caso in cui venga generato il file ```.csv``` è possibile copiarlo dal container di docker sul locale. 
***
### player_stats <a name="stats"></a>
Il token JWT, che deve contenere al suo interno la SECRET_KEY corretta, deve includere un payload con la seguente struttura:
```
{
  "richiedente": "horatio.nelson@gmail.com"
}
```
Il richiedente, se non riconosciuto dall'applicazione, non viene autenticato e non può visualizzare le statistiche del giocatore.

Per quanto riguarda i parametri, l'email deve corrispondere ad un giocatore esistente e le date devono essere nel formato YYYY-MM-DD e nell'ordine temporale giusto.

In caso di richiesta andata a buon fine si ottiene una risposta della seguente tipologia:
```
{
    "message": "Ok - The player's stats are shown below!",
    "player": "regy.cekerri@gmail.com",
    "partite_giocate": 3,
    "partite_vinte": 1,
    "partite_perse": 2,
    "numero_minimo_di_mosse_per_partita": 1,
    "numero_massimo_di_mosse_per_partita": 10,
    "numero_medio_di_mosse_per_partita": 4.666666666666667,
    "deviazione_standard_delle_mosse_per_partita": 4.725815626252608
}
```
***
### leaderboard <a name="classifica"></a>
Per questa rotta non è previsto un meccanismo di autenticazione mediante JWT.

Per quanto riguarda i parametri, l'ordine della classifica può essere ascendente ('asc') o discendente ('disc'), mentre il parametro by specifica in base a quale misura effettuare l'ordinamento: partite totali ('games'), vittorie ('wins') o sconfitte ('losses').

In caso di richiesta andata a buon fine si ottiene una risposta della seguente tipologia:
```
{
    "message": "Ok - The leaderboard is shown below!",
    "leaderboard": [
        {
            "email": "davide.malatesta@gmail.com",
            "username": "Davide",
            "wins": 2,
            "losses": 1,
            "total_games": 3
        },
        {
            "email": "capitano.uncino@gmail.com",
            "username": "Capitano Uncino",
            "wins": 1,
            "losses": 0,
            "total_games": 1
        },
        {
            "email": "regy.cekerri@gmail.com",
            "username": "Regy",
            "wins": 1,
            "losses": 2,
            "total_games": 3
        },
        {
            "email": "adriano.mancini@gmail.com",
            "username": "Adriano",
            "wins": 0,
            "losses": 0,
            "total_games": 0
        },
        {
            "email": "cristoforo.colombo@gmail.com",
            "username": "Colombo",
            "wins": 0,
            "losses": 0,
            "total_games": 0
        },
        {
            "email": "francesco.schettino@gmail.com",
            "username": "Schettino",
            "wins": 0,
            "losses": 1,
            "total_games": 1
        },
        {
            "email": "horatio.nelson@gmail.com",
            "username": "Nelson",
            "wins": 0,
            "losses": 0,
            "total_games": 0
        },
        {
            "email": "mugiwara@gmail.com",
            "username": "Rufy",
            "wins": 0,
            "losses": 0,
            "total_games": 0
        },
        {
            "email": "neil.armstrong@gmail.com",
            "username": "Armstrong",
            "wins": 0,
            "losses": 1,
            "total_games": 1
        },
        {
            "email": "will.murdoch@gmail.com",
            "username": "Murdoch",
            "wins": 0,
            "losses": 0,
            "total_games": 0
        }
    ]
}
```
***

### refill_tokens <a name="ricarica"></a>
Il token JWT, che deve contenere al suo interno la SECRET_KEY corretta, deve includere un payload con la seguente struttura:
```
{
  "richiedente": "adriano.mancini@gmail.com"
}
```
Il richiedente deve corrispondere all'admin e se non riconosciuto dall'applicazione, non viene autenticato e non può effettuare la ricarica dei token del giocatore.

Il body deve possedere la seguente struttura:
```
{
  "email": francesco.schettino@gmail.com,
  "tokens": 100
}
```
Per quanto riguarda i parametri: 
* l'email deve corrispondere ad un giocatore esistente;
* il numero di tokens deve essere compreso tra 0 e 100;

In caso di richiesta andata a buon fine si ottiene una risposta della seguente tipologia:
```
{
    "message": "Ok - The user's tokens were successfully refilled!",
    "email": "francesco.schettino@gmail.com",
    "new_tokens": 100.35
}
```
***
### Collection <a name="collection"></a>

É possibile eseguire una serie di test predefiniti importando all'interno di Postman la [collection](https://github.com/regycekerri/PA_battaglia_navale/blob/main/PA_battaglia_navale.postman_collection.json) situata all'interno di tale repository. 

***

## Diagrammi UML <a name="diagrammi"></a>

### Use Case Diagram <a name="casi"></a>
![Use Case Diagram](https://github.com/regycekerri/PA_battaglia_navale/blob/main/UML%20Diagram/casi%20d'uso.jpg)
***

### Interaction Overview Diagram <a name="interaction"></a>
![Interactive Overview Diagram](https://github.com/regycekerri/PA_battaglia_navale/blob/main/UML%20Diagram/overview.jpg)

***

### Sequence Diagrams <a name="sequenze"></a>

* POST/create_game

* POST/make_move

> Note: Le richieste makeMoveVsPlayer e makeMovevsPlayers sono analoghe alla makeMoveVSIA.

* POST/game_state

* POST/game_moves

* POST/player_stats

***

## Pattern utilizzati <a name="pattern"></a>

### Chain of Responsability (CoR) <a name="cor"></a>

La CoR fa parte dei Behavioural Design Pattern e permette di processare una richiesta attraverso l'esecuzione di una catena di funzioni collegate tra loro (handler). Tale pattern è stato realizzato tramite le funzionalità dei middleware i quali rappresentano gli elementi effettivi della catena. In particolare, dopo aver fatto una richiesta, si eseguono in cascata tutti i middleware relativi a quella richiesta e in caso di successo la chiamata viene portata a termine.
L'utlizzo di questa catena fa si che ogni handler della catena effettui un singolo controllo e che trasmetta la richiesta al successivo handler. In questo modo il codice è semplificato e si risparmia del tempo perchè se uno dei ceck non va a buon fine la chiamata restituisce subito l'errore evitando i controlli successivi.
L'implentazione degli handler è visualizzabile nella seguente cartella [middleware](https://github.com/regycekerri/PA_battaglia_navale/tree/main/src/middleware).

*** 

### Factory <a name="factory"></a>

La Factory fa parte dei Creational Design Pattern e fornisce un'interfaccia per la creazione di oggetti lasciando che le sotto classi decidano quale oggetto istanziare.
L'implementazione del factory method è visionabile nella cartella [responses](https://github.com/regycekerri/PA_battaglia_navale/tree/main/src/responses) ed è stato utilizzato per la creazione di oggetti che descrivono errori e successi del servizio, essendo entrambi accumunati dalla medesima struttura: status code (codice di stato HTTP) e messaggio da ritornare nella risposta.

***

### Singleton <a name="singleton"></a>

Il Singleton, facente parte dei Creational Design Pattern, ha come obbiettivo di rendere una classe istanziabile solo una volta fornendo un punto di accesso globale a tale istanza. Tale pattern, implementato nel file [database](https://github.com/regycekerri/PA_battaglia_navale/blob/main/src/models/database.ts) attraverso la libreria sequelize, è stato utilizzato per stabilire una connessione "unica" con il database. In particolare se la connessione non è stata già creata, viene creata, altrimenti viene restituita la connessione già esistente. In questo modo si ha la certezza di lavorare sulla medesima istanza.

***

### Builder <a name="builder"></a>

Il Builder fa parte del Creational Design Pattern e consente di creare oggetti complessi passo per passo. In altre parole, consente di produrre differenti tipi e rappresentazioni di oggerri, utilizzando lo stesso codice di costruzione. L'implementazione di tale pattern è visionabile nella cartella [grid](https://github.com/regycekerri/PA_battaglia_navale/tree/main/src/models/grid) infatti è stato utilizzato per la costruzione della griglia dei giocatori specifando i parametri in ingresso.

***

# Software utilizzati <a name="software"></a>
* [Visual Studio Code](https://code.visualstudio.com/) - Ambiente di sviluppo
* [Docker](https://www.docker.com/) - Gestore di container
* [Postman](https://www.postman.com/) - Software per l'API Testing 
* [Visual Paradigm](https://www.visual-paradigm.com/) - Software per la generazione dei diagrammi UML

***

# Autori <a name="autori"></a>
* Regy Cekerri
* Davide Malatesta
