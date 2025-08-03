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

  test.each([
    [
      [10, 0],
      [0, 0],
    ],
    [
      [0, 10],
      [9, 9],
    ],
    [
      [-1, 5],
      [5, 5],
    ],
    [
      [5, -1],
      [5, 5],
    ],
    [
      [0, 0],
      [10, 10],
    ],
    [
      [0, 0],
      [-1, -1],
    ],
  ])(
    "should throw for invalid grid position: start=%p end=%p",
    (start, end) => {
      expect(() => board.validateShipPosition(start, end)).toThrow(
        "Invalid position",
      );
    },
  );

  test("should throw if start or end is already occupied by a ship", () => {
    board.shipDeployment([0, 0], [0, 2]);
    expect(() => board.validateShipPosition([0, 0], [0, 3])).toThrow(
      "Invalid position",
    );
    expect(() => board.validateShipPosition([0, 1], [0, 4])).toThrow(
      "Invalid position",
    );
    expect(() => board.validateShipPosition([0, 2], [1, 2])).toThrow(
      "Invalid position",
    );
  });
});

describe("Gameboard shipDeployment", () => {
  let board;
  beforeEach(() => {
    board = new Gameboard();
    board.createGrid();
  });

  test("should deploy a ship from [0,0] to [0,2]", () => {
    board.shipDeployment([0, 0], [0, 2]);
    expect(board.shipsPosition.length).toBe(1);
    expect(board.shipsPosition[0]).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });

  test("should throw for invalid start or end position", () => {
    expect(() => board.shipDeployment([10, 0], [0, 2])).toThrow(
      "Invalid position",
    );
    expect(() => board.shipDeployment([0, 0], [0, 10])).toThrow(
      "Invalid position",
    );
  });

  test("should throw if deploying on an occupied cell", () => {
    board.shipDeployment([0, 0], [0, 2]);
    expect(() => board.shipDeployment([0, 1], [0, 3])).toThrow(
      "Invalid position",
    );
    expect(() => board.shipDeployment([0, 2], [1, 2])).toThrow(
      "Invalid position",
    );
  });
});

describe("Gameboard receiveAttack", () => {
  let board;
  beforeEach(() => {
    board = new Gameboard();
    board.createGrid();
    board.shipDeployment([0, 0], [0, 2]); // Places ship at [0,0], [0,1], [0,2]
  });

  test("should return false if attack misses", () => {
    expect(board.receiveAttack([1, 1])).toBe(false);
    expect(board.receiveAttack([9, 9])).toBe(false);
  });

  test("should record missed shots", () => {
    board.receiveAttack([5, 5]);
    expect(board.missedShots).toContainEqual([5, 5]);
  });
  test("should record hitted shots", () => {
    board.receiveAttack([0, 0]);
    expect(board.hittedShots).toContainEqual([0, 0]);
  });
});

describe("Gameboard allShipsSunk", () => {
  let board;
  beforeEach(() => {
    board = new Gameboard();
    board.createGrid();
    board.shipDeployment([0, 0], [0, 2]); // Ship at [0,0],[0,1],[0,2]
    board.shipDeployment([1, 0], [1, 1]); // Ship at [1,0],[1,1]
  });

  test("should return false if not all ships are sunk", () => {
    board.receiveAttack([0, 0]);
    board.receiveAttack([0, 1]);
    // [0,2] and [1,0],[1,1] not hit yet
    expect(board.allShipsSunk()).toBe(false);
  });

  test("should return true if all ships are sunk", () => {
    board.receiveAttack([0, 0]);
    board.receiveAttack([0, 1]);
    board.receiveAttack([0, 2]);
    board.receiveAttack([1, 0]);
    board.receiveAttack([1, 1]);
    expect(board.allShipsSunk()).toBe(true);
  });
});
