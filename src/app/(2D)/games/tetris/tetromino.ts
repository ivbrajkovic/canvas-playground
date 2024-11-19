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
  color?: string;
};

/**
 * Creates a I-shaped Tetromino (I-piece).
 * The shape is represented as:
 * ```
 * [0, 0, 0, 0],
 * [1, 1, 1, 1],
 * [0, 0, 0, 0],
 * [0, 0, 0, 0],
 * ```
 * @param x - The initial x-coordinate position of the Tetromino
 * @param y - The initial y-coordinate position of the Tetromino
 * @returns A Tetromino object containing the shape matrix and position coordinates
 */
export const createIShape = (x: number, y: number): Tetromino => ({
  shape: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  x,
  y,
});

/**
 * Creates a square-shaped Tetromino piece.
 * The shape is represented as:
 * ```
 * [1, 1]
 * [1, 1]
 * ```
 * @param x - The initial x-coordinate position of the tetromino
 * @param y - The initial y-coordinate position of the tetromino
 * @returns A Tetromino object with a 2x2 square shape matrix and position coordinates
 */
export const createSquareShape = (x: number, y: number): Tetromino => ({
  shape: [
    [1, 1],
    [1, 1],
  ],
  x,
  y,
});

/**
 * Creates a T-shaped Tetromino piece
 * The shape is represented as:
 * ```
 * [1, 1, 1]
 * [0, 1, 0]
 * ```
 * @param x - The initial x coordinate position of the tetromino
 * @param y - The initial y coordinate position of the tetromino
 * @returns A new Tetromino object representing a T-shape
 */
export const createTShape = (x: number, y: number): Tetromino => ({
  shape: [
    [1, 1, 1],
    [0, 1, 0],
  ],
  x,
  y,
});

/**
 * Creates an L-shaped Tetromino piece.
 * The shape is represented as:
 * ```
 * 1 0
 * 1 0
 * 1 1
 * ```
 * @param x - The initial x-coordinate position of the tetromino
 * @param y - The initial y-coordinate position of the tetromino
 * @returns A Tetromino object with L shape configuration and position
 */
export const createLShape = (x: number, y: number): Tetromino => ({
  shape: [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
  x,
  y,
});

/**
 * Creates a J-shaped Tetromino piece at the specified coordinates.
 * The J shape is represented by a 3x2 matrix where 1 indicates a filled cell:
 * ```
 *  0 1
 *  0 1
 *  1 1
 * ```
 * @param x - The initial x-coordinate position of the tetromino
 * @param y - The initial y-coordinate position of the tetromino
 * @returns A Tetromino object with the J shape and specified position
 */
export const createJShape = (x: number, y: number): Tetromino => ({
  shape: [
    [0, 1],
    [0, 1],
    [1, 1],
  ],
  x,
  y,
});

/**
 * Creates an S-shaped Tetromino piece
 * The shape is represented as:
 * ```
 * [0 1 1]
 * [1 1 0]
 * ```
 * @param x The initial x-coordinate position of the tetromino
 * @param y The initial y-coordinate position of the tetromino
 * @returns A Tetromino object with an S-shape pattern and its position
 */
export const createSShape = (x: number, y: number): Tetromino => ({
  shape: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  x,
  y,
});

/**
 * Creates a Z-shaped Tetromino piece
 * The shape is represented as:
 * ```
 * [1 1 0]
 * [0 1 1]
 * ```
 * @param x - The initial x coordinate of the tetromino
 * @param y - The initial y coordinate of the tetromino
 * @returns A Tetromino object containing the shape and position
 */
export const createZShape = (x: number, y: number): Tetromino => ({
  shape: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  x,
  y,
});

/**
 * Creates a random Tetromino shape at the specified coordinates.
 *
 * @param x - The x-coordinate where the shape will be created
 * @param y - The y-coordinate where the shape will be created
 * @returns A new Tetromino instance with a randomly selected shape
 *
 * @remarks
 * The shape is randomly selected from the following types:
 * - Line (I)
 * - Square (O)
 * - T-shape (T)
 * - L-shape (L)
 * - J-shape (J)
 * - S-shape (S)
 * - Z-shape (Z)
 */
export const createRandomTetromino = (x: number, y: number) => {
  const tetrominoCreators = [
    createSquareShape,
    createIShape,
    createTShape,
    createLShape,
    createJShape,
    createSShape,
    createZShape,
  ];
  const randomIndex = Math.floor(Math.random() * tetrominoCreators.length);
  return tetrominoCreators[randomIndex](x, y);
};

export type Direction = 'left' | 'right' | 'up' | 'down';

/**
 * Moves a tetromino in the specified direction.
 * @param tetromino - The tetromino to move
 * @param direction - The direction to move the tetromino ('left', 'right', 'up', 'down')
 * @returns A new tetromino with updated coordinates based on the direction
 */
export const moveTetromino = (
  tetromino: Tetromino,
  direction: Direction,
): Tetromino => {
  switch (direction) {
    case 'left':
      return { ...tetromino, x: tetromino.x - 1 };
    case 'right':
      return { ...tetromino, x: tetromino.x + 1 };
    case 'up':
      return { ...tetromino, y: tetromino.y - 1 };
    case 'down':
      return { ...tetromino, y: tetromino.y + 1 };
    default:
      return tetromino;
  }
};

/**
 * Rotates a Tetromino shape 90 degrees clockwise.
 * The rotation is achieved by transposing the matrix and reversing each row.
 *
 * @param tetromino - The Tetromino object to be rotated
 * @returns A new Tetromino object with the rotated shape
 *
 * @example
 * ```typescript
 *  const tetromino = {
 *    shape: [
 *      [0, 1, 0],
 *      [1, 1, 1],
 *    ],
 *    x: 0,
 *    y: 0
 *  };
 *  const rotatedTetromino = rotateTetromino(tetromino);
 *  // rotatedTetromino.shape:
 *  // [
 *  //   [1, 0],
 *  //   [1, 1],
 *  //   [1, 0]
 *  // ]
 * ```
 */
export const rotateTetromino = (tetromino: Tetromino): Tetromino => {
  const { shape } = tetromino;
  const newShape = shape[0].map((_, i) => shape.map((row) => row[i]).reverse());

  return { ...tetromino, shape: newShape };
};

/**
 * Checks if a Tetromino is colliding with the grid boundaries or other blocks.
 *
 * @param tetromino - The Tetromino object containing shape and position information
 * @param grid - The game grid represented as a 2D array of numbers
 * @returns True if the Tetromino is colliding, false otherwise
 *
 * @remarks
 * The function performs two types of collision checks:
 * 1. Boundary collision - checks if the Tetromino is outside the grid
 * 2. Block collision - checks if the Tetromino overlaps with existing blocks
 *
 * Non-zero values in the shape array are considered solid blocks.
 * Non-zero values in the grid array are considered occupied spaces.
 *
 * @example
 * ```typescript
 * const tetromino = {
 *   shape: [
 *     [1, 1],
 *     [1, 1],
 *   ],
 *   x: 2,
 *   y: 0,
 * };
 * const grid = [
 *   [0, 0, 0, 0],
 *   [0, 0, 0, 0],
 *   [1, 1, 1, 1],
 *   [1, 1, 1, 1],
 * ];
 * const isColliding = isTetrominoColliding(tetromino, grid); // true
 * ```
 */
export const isTetrominoColliding = (
  tetromino: Tetromino,
  grid: number[][],
): boolean => {
  const { shape, x, y } = tetromino;
  const rowLength = shape.length;
  const columnLength = shape[0].length;

  for (let row = 0; row < rowLength; row++) {
    for (let col = 0; col < columnLength; col++) {
      if (shape[row][col] === 0) continue;

      const gridX = x + col;
      const gridY = y + row;

      // Check if the Tetromino is outside the grid
      if (gridX < 0 || gridX >= grid[0].length || gridY < 0 || gridY >= grid.length) {
        return true;
      }

      // Check if the Tetromino is colliding with the grid
      if (grid[gridY][gridX] !== 0) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Merges a tetromino with the game grid by overlaying the tetromino's shape onto the grid at its current position.
 * Creates a new grid to avoid mutating the original.
 *
 * @param tetromino - The tetromino object containing shape and position information
 * @param grid - The current state of the game grid
 * @returns A new grid with the tetromino merged into it
 *
 * @example
 * const tetromino = {
 *   shape: [[1,1],[1,1]], x: 0, y: 0 };
 * const grid = [[0,0,0], [0,0,0], [0,0,0]];
 * const newGrid = mergeTetrominoWithGrid(tetromino, grid);
 * // newGrid:
 * // [
 * //   [1, 1, 0],
 * //   [1, 1, 0],
 * //   [0, 0, 0]
 * // ]
 */
export const mergeTetrominoWithGrid = (
  tetromino: Tetromino,
  grid: number[][],
): number[][] => {
  const { shape, x, y } = tetromino;
  const newGrid = grid.map((row) => [...row]);

  shape.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === 0) return;

      const gridX = x + colIndex;
      const gridY = y + rowIndex;

      newGrid[gridY][gridX] = cell;
    });
  });

  return newGrid;
};
