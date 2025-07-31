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
    const shipKeys = [];
    const visitedKeys = new Set();
    const parentKeys = new Map();

    this.validateShipPosition(start, end);

    const keysForShip = [
      [0, 1],
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
    ];

    shipKeys.push(start);
    visitedKeys.add(this.key(start));
    parentKeys.set(this.key(start), null);

    while (shipKeys.length > 0) {
      let currentStep = shipKeys.shift();
      let [x, y] = currentStep;

      if (x === end[0] && y === end[1]) {
        // Reconstruct pathKeys
        let pathKeys = [];
        let curr = this.key(end);
        while (curr) {
          const [cx, cy] = curr.split(",").map(Number);
          pathKeys.unshift([cx, cy]);
          curr = parentKeys.get(curr);
        }
        this.shipsNumber++;

        return this.shipsPosition.push(pathKeys);
      }
      for (let [k, j] of keysForShip) {
        const newX = x + k;
        const newY = y + j;
        const step = [newX, newY];
        const stepKey = this.key(step);
        if (
          newX >= 0 &&
          newX <= 9 &&
          newY >= 0 &&
          newY <= 9 &&
          !visitedKeys.has(stepKey)
        ) {
          shipKeys.push(step);
          visitedKeys.add(stepKey);
          parentKeys.set(stepKey, this.key(currentStep));
        }
      }
    }
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
