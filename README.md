# *Battaglia Navale*
![alt text](http://ar-entertainment.net/wp/wp-content/uploads/2019/01/Simulator-Screen-Shot-iPad-Pro-12.9-inch-2nd-generation-2018-11-21-at-10.16.51.png)
# Indice
1. [Introduzione](#introduzione)
2. [Richieste](#rotte)
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
    2. [Sequence Diagram](#sequenze)
5. [Pattern utilizzati](#pattern)
    1. [Chain of Responsibility](#cor)
    2. [Factory Method](#factory)
    3. [Singleton](#singleton)
    4. [Builder](#builder)
    5. [Model-View-Controller](#mvc)
6. [Avvio tramite docker](#docker)
7. [Software utilizzati](#software)
8. [Autori](#autori)

## Introduzione <a name="introduzione"></a>

L'obiettivo del progetto è realizzare un sistema che consenta di gestire il gioco della battaglia navale. 

In particolare, il sistema deve prevedere la possibilità di far interagire 2 o 3 utenti oppure un utente contro l'elaboratore.

Gli utenti per poter partecipare ad una partita devono autentificarsi tramite un JWT (generabile al seguente [link](https://jwt.io)) e devono possedere almeno 0.40 token. Ad ogni mossa effettuata vengono addebitati 0.01 token a ciascun giocatore (in caso di esaurimento dei token è possibile comunque terminare la partita).

Il valore iniziale dei token di ciascun utente è inizializzato nel seeding del database.

Ci possono essere più partite attive nello stesso momento ma un utente può partecipare ad una ed una sola partita.

## Richieste <a name="rotte"></a>

Le richieste elencate di seguito possono essere testate attraverso ```http://localhost:8080/nome_della_richiesta``` .

| Tipo         | Rotte         | Descrizione   | JWT |
| ------------ |---------------|---------------|---------|
|   ```POST``` | /create_game  | Richiesta che permette di creare una partita| SI |
|   ```POST``` | /make_move    | Richiesta che consente di effettuare una mossa| SI |
|   ```GET```  | /game_state/id_game   | Richiesta che consente di valutare lo stato di una partita| SI |
|   ```GET```  | /game_moves/id_game?csv=   | Richiesta che restituisce lo storico delle mosse di una data partita con la possibilità di esportare in CSV| SI |
|   ```GET```  | /player_stats/email?data_inizio=&data_fine= | Richiesta che restituisce le statistiche di un utente con la possibilità di filtrare per date| SI |
|   ```GET```  | /leaderboard  | Richiesta che restituisce la classifica dei giocatori| NO |
|   ```POST``` | /refill_tokens| Richiesta che consente all'utente con ruolo admin di effettuare la ricarica dei token di un utente| SI |

***
### /create_game <a name="creategame"></a>

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
* in relazione alla modalità di gioco devono essere inserite delle email appropriate (nel numero giusto);
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
  "player2": "davide.malatesta@gmail.com",
  "player3": "",
  "ia": false
}
```
***
### /make_move <a name="makemove"></a>

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
* x e y corrispondono rispettivamente alla riga e alla colonna della cella da attaccare.

Inoltre, devono essere rispettati i seguenti vincoli:
* l'id della partita deve corrispondere ad una partita effettivamente esistente e ancora in corso;
* il richiedente può attaccare soltanto se è il suo turno;
* la cella da attaccare deve esistere e non deve essere già stata attaccata.

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
### /game_state/id_game <a name="gamestate"></a>

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

### /game_moves/id_game?csv= <a name="gamemoves"></a>

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
### /player_stats/email?data_inizio=&data_fine= <a name="stats"></a>
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
### /leaderboard <a name="classifica"></a>
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

### /refill_tokens <a name="ricarica"></a>
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
* il numero di tokens deve essere compreso tra 0 e 100.

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

### Sequence Diagrams <a name="sequenze"></a>

* POST: /create_game

![create_game](https://github.com/regycekerri/PA_battaglia_navale/blob/main/UML%20Diagram/1_create_game.png)

* POST: /make_move

![make_move](https://github.com/regycekerri/PA_battaglia_navale/blob/main/UML%20Diagram/2_make_move.png)

* GET: /game_state/id_game

![game_state](https://github.com/regycekerri/PA_battaglia_navale/blob/main/UML%20Diagram/3_game_state.jpg)

* GET: /game_moves/id_game?csv=

![game_moves](https://github.com/regycekerri/PA_battaglia_navale/blob/main/UML%20Diagram/4_game_moves.jpg)

* GET: /player_stats/email?data_inizio=&data_fine= 

![stats](https://github.com/regycekerri/PA_battaglia_navale/blob/main/UML%20Diagram/5_player_stats.jpg)

* GET: /leaderboard

![classifica](https://github.com/regycekerri/PA_battaglia_navale/blob/main/UML%20Diagram/6_leaderboard.jpg)

* POST: /refill_tokens

![ricarica](https://github.com/regycekerri/PA_battaglia_navale/blob/main/UML%20Diagram/7_refill_tokens.jpg)

***

## Pattern utilizzati <a name="pattern"></a>

### Chain of Responsibility (CoR) <a name="cor"></a>

La Chain of Responsibility fa parte dei Behavioral Design Pattern e consente di processare una richiesta attraverso una catena di handler. Alla ricezione della richiesta, ciascun handler decide se processarla o se passarla al prossimo handler della catena.

Tale pattern è particolarmente utile nelle situazioni in cui si desidera implementare un meccanismo di validazione e autenticazione delle richieste, esattamente come quello di cui necessita la nostra applicazione. Non utilizzare il pattern significa inserire tutta la logica di autenticazione e validazione in un'unica classe, costringendo l'applicazione ad effettuare molto spesso dei controlli superflui. Il pattern, separando la logica di autenticazione e validazione in più step, consente di interrompere la richiesta già al primo errore riscontrato, evitando uno spreco di tempo e di risorse.

Nel progetto, il pattern è stato utilizzato per realizzare il meccanismo di autenticazione, per le richieste in cui è previsto, e il meccanismo di validazione, per verificare che una richiesta sia effettivamente ben formata e con i parametri corretti. L'utilizzo del pattern migliora anche la scalabilità e la manutenibilità del codice (aggiungere un controllo aggiuntivo diventa infatti decisamente più semplice).

Nella seguente cartella [middleware](https://github.com/regycekerri/PA_battaglia_navale/tree/main/src/middleware) è possibile osservare l'implementazione del pattern.

*** 

### Factory Method<a name="factory"></a>

Il Factory Method fa parte dei Creational Design Pattern e fornisce un'interfaccia per la creazione di oggetti in una superclasse, concedendo però alle sottoclassi la possibilità di alterare il tipo di oggetti che saranno creati.

Il pattern risulta particolarmente utile nelle situazioni in cui sono necessarie molteplici classi implementanti un'interfaccia comune, come ad esempio nella generazione degli oggetti rappresentati gli errori e i successi restituiti in risposta alla richieste effettuate verso l'applicazione. Infatti, tali oggetti sono accumunati dal fatto di restituire un HTTP status code e il messaggio da visualizzare nella risposta.

Nella seguente cartella [responses](https://github.com/regycekerri/PA_battaglia_navale/tree/main/src/responses) è possibile osservare l'implementazione del pattern.

***

### Singleton <a name="singleton"></a>

Il Singleton è un Creational Design Pattern che consente ad una classe di possedere un'unica istanza, fornendo un punto di accesso globale a tale istanza.

Tale pattern risulta ad esempio particolarmente utile nell'instaurazione di una connessione ad un database (nel nostro caso si è sfruttata la libreria sequelize). La connessione ad un database può infatti necessitare di tempo e risorse, perciò è insensato instaurarne una nuova ogni qualvolta se ne ha bisogno. Il pattern consente quindi di inizializzare una connessione una prima volta e di impedire che ne venga creata una nuova in seguito (manipolando l'accesso al costruttore della classe). Un tentativo di creare una nuova connessione restituisce infatti l'istanza già esistente.

Nel seguente file [database.ts](https://github.com/regycekerri/PA_battaglia_navale/blob/main/src/models/database.ts) è possibile osservare l'implementazione del pattern.

***

### Builder <a name="builder"></a>

Il Builder è un Creational Design Pattern che consente di creare oggetti complessi passo per passo. Il pattern consente dunque di produrre differenti tipi e rappresentazioni di un oggetto utilizzando lo stesso codice di costruzione.

Nel nostro caso, il pattern è stato utilizzato per creare un meccanismo più efficace per creare una griglia di una partita. Ciascuna griglia condivide infatti il fatto di avere una dimensione, un numero di navi, una dimensione massima delle navi consentita e un insieme di celle. Ognuna è però diversa nel modo in cui tali parametri vengono utilizzati all'atto della creazione. Risulta dunque particolarmente saggio creare una classe, chiamata builder, capace di creare una griglia sulla base delle specifiche che le vengono fornite. In questo modo è possibile astrarre la costruzione della griglia dall'utilizzo successivo della griglia stessa.

Nella seguente cartella [grid](https://github.com/regycekerri/PA_battaglia_navale/tree/main/src/models/grid) è possibile osservare l'implementazione del pattern.

***
### Model-View-Controller <a name="mvc"></a>

Il Model-View-Controller (MVC) è un modello di architettura del software. Esso prevede un'architettura composta da tre parti diverse: i dati (Model), la visualizzazione dei dati (View) e la gestione degli input (Controller). Questi tre componenti sono interconnessi: il Model viene mostrato tramite la View all'utente, il quale produce gli input con cui il Controller aggiorna il Model.
Mantenerli logicamente separati però ha grandi vantaggi nella gestione del codice, infatti questo pattern favorisce lo sviluppo, il test e la manutenzione di ciascuna parte indipendentemente dall'altra.

Nel nostro caso, trattandosi il progetto di un back-end, non è stato utilizzato effettivamente tale pattern, ma ne sono stati presi alcuni punti come riferimento. Un back-end infatti è privo di un'interfaccia, e quindi è necessariamente assente il Model. Tuttavia è possibile separare la logica di gestione delle richieste dalla logica di gestione dei dati, attraverso un Model e un Controller ben distinti.

Nel progetto, nel suo complesso, è possibile osservare l'implementazione del pattern.

***

## Avvio tramite Docker <a name="docker"></a>

L'avvio del sistema prevede l'utilizzo di [docker](https://www.docker.com/products/docker-desktop/) e un API testing come [postman](https://www.postman.com/downloads/) per effetture le chiamate per testare il progetto.

Il sistema si può avviare attraverso docker dopo aver effettuato la clone dell'attuale [repository](https://github.com/regycekerri/PA_battaglia_navale) sulla propria macchina locale.

Dopo aver fatto ciò, tramite il prompt dei comandi, bisogna collocarsi all'interno della cartella, avviare docker ed eseguire il comando ```docker-compose up``` . Il back-end, generato da Docker attraverso due container rispettivamente eseguiti a partite da un'immagine Node.js e da un'immagine MySQL, sarà in ascolto alle porte 8080 (per quanto riguarda Node) e 3305 (per quanto riguarda il db).

Il client si interfaccerà con il servizio tramite postman, effettuando le chiamate desiderate.

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
