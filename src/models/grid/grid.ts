import { Cell, GridBuilder } from "./gridbuilder";

export class Grid {
    public grid: Cell[][];

    constructor(grid_builder: GridBuilder) {
        this.grid = grid_builder.getGrid();
    }
}