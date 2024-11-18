/**
 * Defines a Tetromino shape.
 * - `shape`: 2D array representing the tetromino.
 * - `x`: X-coordinate (column) position on the grid.
 * - `y`: Y-coordinate (row) position on the grid.
 */
export type Tetromino = {
  shape: number[][];
  x: number; // Column position on the grid
  y: number; // Row position on the grid
};

/**
 * Creates a plus-shaped Tetromino.
 *
 * @param {number} x - Initial X position on the grid.
 * @param {number} y - Initial Y position on the grid.
 * @returns {Tetromino} The plus-shaped tetromino.
 */
export const createPlusShape = (x: number, y: number): Tetromino => ({
  shape: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  x,
  y,
});

/**
 * Creates a minus-shaped Tetromino.
 *
 * @param {number} x - Initial X position on the grid.
 * @param {number} y - Initial Y position on the grid.
 * @returns {Tetromino} The minus-shaped tetromino.
 */
export const createMinusShape = (x: number, y: number): Tetromino => ({
  shape: [
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  x,
  y,
});
