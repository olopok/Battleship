import Gameboard from "./gameboard.js";

class Player {
  constructor(type = "human") {
    this.type = type; // "human" or "computer"
    this.gameboard = new Gameboard();
  }
}

export default Player;
