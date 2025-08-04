export default class Gameboard {
  constructor() {
    this.missedShots = [];
    this.hittedShots = [];
    this.shipsNumber = 0;
    this.shipsPosition = [];
    this.grid = [];
    this.key = ([x, y]) => `${x},${y}`;
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

  shipDeployment(start, end) {
    // Only allow straight lines
    const [x1, y1] = start;
    const [x2, y2] = end;
    if (x1 !== x2 && y1 !== y2) {
      throw new Error("Ships must be placed in a straight line");
    }

    // Collect all coordinates for the ship
    const pathKeys = [];
    if (x1 === x2) {
      // Horizontal
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      for (let y = minY; y <= maxY; y++) {
        pathKeys.push([x1, y]);
      }
    } else {
      // Vertical
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      for (let x = minX; x <= maxX; x++) {
        pathKeys.push([x, y1]);
      }
    }

    // Check if any cell is already occupied or out of bounds
    for (const [x, y] of pathKeys) {
      const key = this.key([x, y]);
      if (
        x < 0 ||
        x > 9 ||
        y < 0 ||
        y > 9 ||
        this.shipsPosition.some((path) =>
          path.some(([px, py]) => px === x && py === y),
        )
      ) {
        throw new Error("Invalid position");
      }
    }

    this.shipsNumber++;
    this.shipsPosition.push(pathKeys);
  }

  validateShipPosition(start, end) {
    function isKeyInGrid(grid, key) {
      return grid.some((row) => row.some((cell) => cell.key === key));
    }
    function isKeyInShips(ships, key) {
      return ships.some((path) => path.some(([x, y]) => `${x},${y}` === key));
    }
    const startKey = this.key(start);
    const endKey = this.key(end);
    if (
      !isKeyInGrid(this.grid, startKey) ||
      !isKeyInGrid(this.grid, endKey) ||
      isKeyInShips(this.shipsPosition, startKey) ||
      isKeyInShips(this.shipsPosition, endKey)
    ) {
      throw new Error("Invalid position");
    }
  }

  receiveAttack(coords) {
    function isKeyInShips(ships, key) {
      return ships.some((path) => path.some(([x, y]) => `${x},${y}` === key));
    }
    const attackKey = `${coords[0]},${coords[1]}`;
    if (isKeyInShips(this.shipsPosition, attackKey)) {
      // Mark grid as hit
      this.grid[coords[0]][coords[1]] = { value: 1 };
      // Optionally: call ship.hit() if you have ship objects
      this.hittedShots.push(coords);
      return true;
    } else {
      this.missedShots.push(coords);
      return false;
    }
  }

  allShipsSunk() {
    // Flatten all ship positions into a single array of keys
    const allShipKeys = this.shipsPosition.flat().map(([x, y]) => `${x},${y}`);
    // Convert hittedShots to keys
    const hitKeys = this.hittedShots.map(([x, y]) => `${x},${y}`);
    // Every ship cell must be in hitKeys
    return allShipKeys.every((key) => hitKeys.includes(key));
  }
}
