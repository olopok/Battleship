export default class Ship {
  constructor(length) {
    this.length = length;
    this.hit = 0;
  }

  hits() {
    if (this.hit < this.length) return this.hit++;
  }

  isSunk() {
    if (this.hit >= this.length) {
      return true;
    } else;
    return false;
  }
}
