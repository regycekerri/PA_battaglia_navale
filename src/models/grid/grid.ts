import { Cell, GridBuilder } from "./gridbuilder";

export class Grid {
    private grid: Cell[][];

    constructor(grid_builder: GridBuilder) {
        this.grid = grid_builder.getGrid();
    }
}