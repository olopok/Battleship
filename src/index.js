import "../css/style.css";
import "./ship.js";
import Gameboard from "./gameboard.js";
import "./player.js";
import { deployRandomShipsForPlayer, displayShipsOnBoard } from "./player.js";
import { renderGrid, createPlayers, displayPlayersInfo } from "./DOMrender.js";

let players;
let currentPlayer = "human"; // Track whose turn it is
let computerTargets = []; // Stack of coordinates to try after a hit
let lastComputerHit = null; // Last hit coordinate

document.addEventListener("DOMContentLoaded", () => {
  renderGrid("player1");
  renderGrid("player2");

  const startBtn = document.getElementById("start-game-btn");
  const deployBtn = document.getElementById("deploy-ship");

  startBtn.addEventListener("click", () => {
    players = createPlayers();
    displayPlayersInfo("players-info-container", players);
    currentPlayer = "human";
  });

  deployBtn.addEventListener("click", () => {
    if (!players) {
      alert("Please start the game first!");
      return;
    }
    // Reset gameboards and grids
    players.human.gameboard = new Gameboard();
    players.human.gameboard.createGrid();
    players.computer.gameboard = new Gameboard();
    players.computer.gameboard.createGrid();
    renderBoards();
    deployRandomShipsForPlayer(players.human);
    deployRandomShipsForPlayer(players.computer);
    renderBoards();
    currentPlayer = "human";
  });

  const resetBtn = document.getElementById("reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      // Reset all game state
      players = undefined;
      currentPlayer = "human";
      renderGrid("player1");
      renderGrid("player2");
      document.getElementById("players-info-container").innerHTML = "";
      // Hide the deploy-ship button
      const deployBtn = document.getElementById("deploy-ship");
      if (deployBtn) deployBtn.classList.add("hidden");
            computerTargets = [];
    });
  }

  enablePlayerAttacks("player2");
});

function enablePlayerAttacks(enemyBoardId) {
  const container = document.getElementById(enemyBoardId);
  container.addEventListener("click", (e) => {
    if (currentPlayer !== "human") return; // Only allow if it's the human's turn

    const cell = e.target.closest("td.cell");
    if (!cell) return;
    const row = parseInt(cell.dataset.row, 10);
    const col = parseInt(cell.dataset.col, 10);

    // Prevent attacking the same cell twice
    const alreadyAttacked = players.computer.gameboard.hittedShots
      .concat(players.computer.gameboard.missedShots)
      .some(([r, c]) => r === row && c === col);
    if (alreadyAttacked) return;

    // Player attacks
    players.computer.gameboard.receiveAttack([row, col]);
    renderBoards();

    // Check for win
    if (players.computer.gameboard.allShipsSunk()) {
      alert("You win!");
      return;
    }

    // Switch to computer turn
    currentPlayer = "computer";
    setTimeout(computerMove, 700); // Delay for realism
  });
}

function computerMove() {
  // If there are targets from a previous hit, try those first (hunt mode)
  if (computerTargets.length > 0) {
    const [row, col] = computerTargets.pop();
    if (alreadyAttackedByComputer(row, col)) {
      setTimeout(computerMove, 100); // Skip to next target if already attacked
      return;
    }
    const hit = players.human.gameboard.receiveAttack([row, col]);
    renderBoards();
    if (hit) {
      // Add adjacent cells to targets stack
      addAdjacentTargets(row, col);
      if (players.human.gameboard.allShipsSunk()) {
        alert("Computer wins!");
        return;
      }
      // Computer gets another turn after a hit
      setTimeout(computerMove, 700);
      return;
    }
    // Miss: switch back to human
    currentPlayer = "human";
    return;
  }

  // Otherwise, pick a random move (search mode)
  const possibleMoves = [];
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      if (!alreadyAttackedByComputer(row, col)) possibleMoves.push([row, col]);
    }
  }
  if (possibleMoves.length === 0) return;

  const [row, col] =
    possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  const hit = players.human.gameboard.receiveAttack([row, col]);
  renderBoards();
  if (hit) {
    addAdjacentTargets(row, col);
    if (players.human.gameboard.allShipsSunk()) {
      alert("Computer wins!");
      return;
    }
    // Computer gets another turn after a hit
    setTimeout(computerMove, 700);
    return;
  }
  // Miss: switch back to human
  currentPlayer = "human";
}

function renderBoards() {
  renderGrid("player1");
  renderGrid("player2");
  displayShipsOnBoard(players.human, "player1");
  // Do NOT display computer ships on player2's board:
  // displayShipsOnBoard(players.computer, "player2");
  markShots(players.human.gameboard, "player1");
  markShots(players.computer.gameboard, "player2");
}

function markShots(gameboard, containerId) {
  const container = document.getElementById(containerId);
  gameboard.hittedShots.forEach(([row, col]) => {
    const cell = container.querySelector(
      `td[data-row="${row}"][data-col="${col}"]`,
    );
    if (cell) cell.classList.add("hit-cell");
  });
  gameboard.missedShots.forEach(([row, col]) => {
    const cell = container.querySelector(
      `td[data-row="${row}"][data-col="${col}"]`,
    );
    if (cell) cell.classList.add("miss-cell");
  });
}

function alreadyAttackedByComputer(row, col) {
  return players.human.gameboard.hittedShots
    .concat(players.human.gameboard.missedShots)
    .some(([r, c]) => r === row && c === col);
}

function addAdjacentTargets(row, col) {
  const deltas = [
    [-1, 0], // up
    [1, 0], // down
    [0, -1], // left
    [0, 1], // right
  ];
  deltas.forEach(([dr, dc]) => {
    const newRow = row + dr;
    const newCol = col + dc;
    if (
      newRow >= 0 &&
      newRow < 10 &&
      newCol >= 0 &&
      newCol < 10 &&
      !alreadyAttackedByComputer(newRow, newCol) &&
      !computerTargets.some(([r, c]) => r === newRow && c === newCol)
    ) {
      computerTargets.push([newRow, newCol]);
    }
  });
}
