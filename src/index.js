import "../css/style.css";
import "./ship.js";
import "./gameboard.js";
import "./player.js";
import { renderGrid } from "./DOMrender.js";

document.addEventListener("DOMContentLoaded", () => {
    renderGrid("player1");
    renderGrid("player2")
});
