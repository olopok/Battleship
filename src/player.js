import Gameboard from "./gameboard.js";

// Helper to get a random integer in [min, max]
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to get a random orientation
function randomOrientation() {
  return Math.random() < 0.5 ? "horizontal" : "vertical";
}

// Deploy ships of given lengths for a player
export function deployRandomShipsForPlayer(player) {
  // Reset the gameboard and grid before deploying
  player.gameboard = new Gameboard();
  player.gameboard.createGrid();

  const shipLengths = [5, 4, 3, 2];
  shipLengths.forEach((length) => {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 100) {
      attempts++;
      const orientation = randomOrientation();
      let start, end;
      if (orientation === "horizontal") {
        const row = randInt(0, 9);
        const colStart = randInt(0, 10 - length);
        start = [row, colStart];
        end = [row, colStart + length - 1];
      } else {
        const col = randInt(0, 9);
        const rowStart = randInt(0, 10 - length);
        start = [rowStart, col];
        end = [rowStart + length - 1, col];
      }
      try {
        player.gameboard.shipDeployment(start, end);
        placed = true;
      } catch (e) {
        // Try again
      }
    }
    if (!placed) throw new Error("Could not place ship after 100 attempts");
  });
}

// Display ships on the board (for demo, mark cells with a class)
export function displayShipsOnBoard(player, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  player.gameboard.shipsPosition.flat().forEach(([row, col]) => {
    const cell = container.querySelector(
      `td[data-row="${row}"][data-col="${col}"]`,
    );
    if (cell) cell.classList.add("ship-cell");
  });
}

class Player {
  constructor(type = "human") {
    this.type = type; // "human" or "computer"
    this.gameboard = new Gameboard();
  }
}

export default Player;
