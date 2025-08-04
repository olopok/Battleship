import Gameboard from "./gameboard.js";
import Player from "./player.js";

export function renderGrid(containerId) {
  const board = new Gameboard();
  board.createGrid();

  const container = document.getElementById(containerId);
  container.innerHTML = ""; // Clear previous grid if any

  const table = document.createElement("table");
  table.classList.add("gameboard-grid");

  const letters = "ABCDEFGHIJ".split("");

  // Create table header with letters
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const emptyTh = document.createElement("th");
  headerRow.appendChild(emptyTh); // Top-left empty corner
  for (let col = 0; col < 10; col++) {
    const th = document.createElement("th");
    th.textContent = letters[col];
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body with numbers and cells
  const tbody = document.createElement("tbody");
  for (let row = 0; row < 10; row++) {
    const tr = document.createElement("tr");
    const rowHeader = document.createElement("th");
    rowHeader.textContent = row + 1;
    tr.appendChild(rowHeader);
    for (let col = 0; col < 10; col++) {
      const td = document.createElement("td");
      td.dataset.row = row;
      td.dataset.col = col;
      td.classList.add("cell");
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);

  container.appendChild(table);
}

export function createPlayers() {
  const human = new Player("human");
  const computer = new Player("computer");
  return { human, computer };
}

export function displayPlayersInfo(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <div class="players-info">
      <div>Player 1: Human</div>
      <div>Player 2: Computer</div>
    </div>
  `;
  document.getElementById("deploy-ship").classList.remove("hidden");
}
