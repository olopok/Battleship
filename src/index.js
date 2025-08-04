import "../css/style.css";
import "./ship.js";
import Gameboard from "./gameboard.js";
import "./player.js";
import { deployRandomShipsForPlayer, displayShipsOnBoard } from "./player.js";
import { renderGrid, createPlayers, displayPlayersInfo } from "./DOMrender.js";

let players;

document.addEventListener("DOMContentLoaded", () => {
  renderGrid("player1");
  renderGrid("player2");

  const startBtn = document.getElementById("start-game-btn");
  const deployBtn = document.getElementById("deploy-ship");

  startBtn.addEventListener("click", () => {
    players = createPlayers();
    displayPlayersInfo("players-info-container", players);
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
    renderGrid("player1");
    renderGrid("player2");
    deployRandomShipsForPlayer(players.human);
    deployRandomShipsForPlayer(players.computer);
    displayShipsOnBoard(players.human, "player1");
    displayShipsOnBoard(players.computer, "player2");
  });
});
