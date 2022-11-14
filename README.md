# *Battaglia Navale*
![alt text](http://ar-entertainment.net/wp/wp-content/uploads/2019/01/Simulator-Screen-Shot-iPad-Pro-12.9-inch-2nd-generation-2018-11-21-at-10.16.51.png)
# Indice
1. [Introduzione](#introduzione)
2. [Avvio tramite docker](#docker)
3. [Richieste](#rotte)
    1. [Collection](#collection)
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
|   ```POST``` | /game_state   | Richiesta che consente di valutare lo stato di una partita| SI |
|   ```POST``` | /game_moves   | Richiesta che restituisce lo storico delle mosse di una data partita con la possibilità di esportare in CSV| SI |
|   ```POST``` | /player_stats | Richiesta che restituisce le statistiche di un utente con la possibilità di filtrare per date| SI |
|   ```POST``` | /users        | Richiesta che restituisce la classifica dei giocatori| NO |
|   ```POST``` | /admin        | Richiesta che consente all'utente con ruolo admin di effettuare la ricarica dei token di un utente| SI |

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

> **Note:** Note...

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
