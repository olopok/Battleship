/* eslint-disable no-undef */
import Ship from "../ship.js";

test("The ship have been hit", () => {
  const newShip = new Ship(3);

  expect(newShip.isSunk()).toBe(false);
  newShip.hits();
  newShip.hits();
  newShip.hits();
  expect(newShip.isSunk()).toBe(true);
});
