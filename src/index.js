import "../css/style.css";
import "./ship.js";
import "./gameboard.js";
import "./player.js";
import { renderGrid, createPlayers, displayPlayersInfo } from "./DOMrender.js";

document.addEventListener("DOMContentLoaded", () => {
  renderGrid("player1");
  renderGrid("player2");
  const startBtn = document.getElementById("start-game-btn");
  startBtn.addEventListener("click", () => {
    const players = createPlayers();
    displayPlayersInfo("players-info-container", players);
  });
});
