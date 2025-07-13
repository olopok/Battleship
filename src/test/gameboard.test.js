/* eslint-disable no-undef */
import Gameboard from "../gameboard.js";

describe("Gameboard createGrid", () => {
  test("should create a 10x10 grid with coordinate keys", () => {
    const board = new Gameboard();
    const grid = board.createGrid();

    expect(grid.length).toBe(10);
    grid.forEach((row, rowIdx) => {
      expect(row.length).toBe(10);
      row.forEach((cell, colIdx) => {
        expect(cell).toHaveProperty("key", `${rowIdx},${colIdx}`);
      });
    });
  });
});

describe("Gameboard validateShipPosition", () => {
  let board;
  beforeEach(() => {
    board = new Gameboard();
    board.createGrid();
  });

  test("should not throw for valid position", () => {
    expect(() => board.validateShipPosition([0, 0], [9, 9])).not.toThrow();
    expect(() => board.validateShipPosition([5, 5], [0, 9])).not.toThrow();
  });

  test("should throw for invalid position", () => {
    expect(() => board.validateShipPosition([10, 0], [0, 0])).toThrow(
      "Invalid position",
    );
    expect(() => board.validateShipPosition([0, 10], [9, 9])).toThrow(
      "Invalid position",
    );
    expect(() => board.validateShipPosition([-1, 5], [5, 5])).toThrow(
      "Invalid position",
    );
    expect(() => board.validateShipPosition([5, -1], [5, 5])).toThrow(
      "Invalid position",
    );
    expect(() => board.validateShipPosition([0, 0], [10, 10])).toThrow(
      "Invalid position",
    );
    expect(() => board.validateShipPosition([0, 0], [-1, -1])).toThrow(
      "Invalid position",
    );
  });
});
