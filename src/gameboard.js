export default class Gameboard {
  constructor() {
    this.missedShots = [];
    this.hittedShots = [];
    this.shipsNumber = undefined;
    this.shipsPosition = [];
    this.grid = [];
  }

  createGrid() {
    for (let row = 0; row < 10; row++) {
      const rowArr = [];
      for (let col = 0; col < 10; col++) {
        rowArr.push({ key: `${row},${col}` });
      }
      this.grid.push(rowArr);
    }
    return this.grid;
  }

  shipDeployment(x, y) {}

  validateShipPosition(start, end) {
    function isKeyInGrid(grid, key) {
      return grid.some((row) => row.some((cell) => cell.key === key));
    }
    const startKey = `${start[0]},${start[1]}`;
    const endKey = `${end[0]},${end[1]}`;
    if (!isKeyInGrid(this.grid, startKey) || !isKeyInGrid(this.grid, endKey)) {
      throw new Error("Invalid position");
    }
  }

  receiveAttack() {}
}
