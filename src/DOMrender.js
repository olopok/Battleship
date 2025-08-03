import Gameboard from "./gameboard.js";

export function renderGrid(containerId) {
  const board = new Gameboard();
  board.createGrid();

  const container = document.getElementById(containerId);
  container.innerHTML = ""; // Clear previous grid if any

  const table = document.createElement("table");
  table.classList.add("gameboard-grid");

  for (let row = 0; row < 10; row++) {
    const tr = document.createElement("tr");
    for (let col = 0; col < 10; col++) {
      const td = document.createElement("td");
      td.dataset.row = row;
      td.dataset.col = col;
      td.classList.add("cell");
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  container.appendChild(table);
}
