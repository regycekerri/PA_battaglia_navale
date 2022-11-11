import { Grid } from "./grid";
import { getRandomInt } from "./utility";

/**
 * Classe che rappresenta il builder di una griglia.
 */
export class GridBuilder {
    private grid: Cell[][];
    private grid_size: number;
    private number_of_ships: number;
    private maximum_ship_size: number;

    constructor(grid_size: number, number_of_ships: number, maximum_ship_size: number) {
        this.grid_size = grid_size;
        this.number_of_ships = number_of_ships;
        this.maximum_ship_size = maximum_ship_size;
        
        this.grid = [];

        for(let i = 0; i < grid_size; i++){
            this.grid[i] = [];
            for(let j = 0; j < grid_size; j++){
                this.grid[i][j] = new Cell(0, false);
            }
        }
    }

    build(){
        return new Grid(this);
    }

    /**
     * Funzione che restituisce la griglia.
     */
    getGrid() {
        return this.grid;
    }

    /**
     * Funzione che crea le navi secondo un pattern fornito.
     */
    makeShips(dimensions: number[]) {
        for(let i = 0; i < dimensions.length; i++) {
            switch(dimensions[i]) {
                case(1):
                    this.makeShipOfSize1();
                    break;
                case(2):
                    this.makeShipOfSize2();
                    break;
                case(3):
                    this.makeShipOfSize3();
                    break;
            }
        }
        console.log(JSON.stringify(this.grid));
        return this;
    }

    /**
     * Crea una nave di dimensione 1.
     */
    makeShipOfSize1(){
        let x: number;
        let y: number;

        let doable: boolean;

        do {
            console.log("1");
            doable = true;
            x = getRandomInt(0, this.grid_size - 1);
            y = getRandomInt(0, this.grid_size - 1);

            for(let i = (x - 1); i <= (x + 1); i++) {
                for(let j = (y - 1); y <= (y + 1); j++) {
                    if((i >= 0) && (i <= this.grid_size - 1) && (j >= 0) && (j <= this.grid_size - 1)) {
                        if(this.grid[i][j].type !== 0) {
                            doable = false;
                        }
                    }
                }
            }
        } while (!doable);
        
        this.grid[x][y].type = 1;
    }

    /**
     * Crea una nave di dimensione 2.
     */
    makeShipOfSize2() {
        let x1: number;
        let x2: number;
        let y1: number;
        let y2: number;

        let doable: boolean;

        //0: verso destra, 1: verso il basso.
        let direction: number = getRandomInt(0, 1);

        do {
            console.log("2");
            doable = true;
            x1 = getRandomInt(0, this.grid_size - 1);
            y1 = getRandomInt(0, this.grid_size - 1);

            if(direction === 0) {
                x2 = x1;
                y2 = y1 + 1;
                
                if(y2 >= this.grid_size) {
                    doable = false;
                }

                for(let i = (x1 - 1); i <= (x1 + 1); i++) {
                    for(let j = (y1 - 1); j <= (y1 + 2); j++) {
                        if((i >= 0) && (i <= this.grid_size - 1) && (j >= 0) && (j <= this.grid_size - 1)) {
                            if(this.grid[i][j].type !== 0) {
                                doable = false;
                            }
                        }
                    }
                }
            } else {
                x2 = x1 + 1;
                y2 = y1;

                if(x2 >= this.grid_size) {
                    doable = false;
                }

                for(let i = (x1 - 1); i <= (x1 + 2); i++) {
                    for(let j = (y1 - 1); j <= (y1 + 1); j++) {
                        if((i >= 0) && (i <= this.grid_size - 1) && (j >= 0) && (j <= this.grid_size -1)) {
                            if(this.grid[i][j].type !== 0) {
                                doable = false;
                            }
                        }
                    }
                }
            }
        } while (!doable);
        this.grid[x1][y1].type === 2;
        this.grid[x2][y2].type === 2;
    }

    /**
     * Crea una nave di dimensione 3.
     */
     makeShipOfSize3() {
        let x1: number;
        let x2: number;
        let x3: number;
        let y1: number;
        let y2: number;
        let y3: number;

        let doable: boolean;

        //0: verso destra, 1: verso il basso.
        let direction: number = getRandomInt(0, 1);

        do {
            console.log("3");
            doable = true;
            x1 = getRandomInt(0, this.grid_size - 1);
            y1 = getRandomInt(0, this.grid_size - 1);

            if(direction === 0) {
                x2 = x1;
                y2 = y1 + 1;

                x3 = x1;
                y3 = y1 + 2;
                
                if((y2 >= this.grid_size) || (y3 >= this.grid_size)) {
                    doable = false;
                }

                for(let i = (x1 - 1); i <= (x1 + 1); i++) {
                    for(let j = (y1 - 1); j <= (y1 + 3); j++) {
                        if((i >= 0) && (i <= this.grid_size - 1) && (j >= 0) && (j <= this.grid_size - 1)) {
                            if(this.grid[i][j].type !== 0) {
                                doable = false;
                            }
                        }
                    }
                }
            } else {
                x2 = x1 + 1;
                y2 = y1;

                x3 = x1 + 2;
                y3 = y1;

                if((x2 >= this.grid_size) || (x3 >= this.grid_size)) {
                    doable = false;
                }

                for(let i = (x1 - 1); i <= (x1 + 3); i++) {
                    for(let j = (y1 - 1); j <= (y1 + 1); j++) {
                        if((i >= 0) && (i <= this.grid_size - 1) && (j >= 0) && (j <= this.grid_size - 1)) {
                            if(this.grid[i][j].type !== 0) {
                                doable = false;
                            }
                        }
                    }
                }
            }
        } while (!doable);
        this.grid[x1][y1].type === 3;
        this.grid[x2][y2].type === 3;
        this.grid[x3][y3].type === 3;
    }
}

/**
 * Classe che rappresenta una cella della griglia. In particolare:
 * -) l'attributo type specifica la tipologia della cella e può assumere i valori: 0 (cella vuota), 1 (nave da 1),
 *    2 (parte di una nave da 2), 3 (parte di una nave da 3);
 * -) l'attributo attacked specifica se la cella è già stata attaccata o meno.
 */
 export class Cell {
    public type: number;
    public attacked: boolean;

    constructor(type: number, attacked: boolean) {
        this.type = type;
        this.attacked = attacked;
    }
}