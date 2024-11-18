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
 * Creates a vertical line-shaped Tetromino.
 *
 * @param {number} x - Initial X position on the grid.
 * @param {number} y - Initial Y position on the grid.
 * @returns {Tetromino} The vertical line-shaped tetromino.
 */
export const createVerticalLineShape = (x: number, y: number): Tetromino => ({
  shape: [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  x,
  y,
});

/**
 * Creates a square-shaped Tetromino.
 *
 * @param {number} x - Initial X position on the grid.
 * @param {number} y - Initial Y position on the grid.
 * @returns {Tetromino} The square-shaped tetromino.
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
 * Creates a T-shaped Tetromino.
 *
 * @param {number} x - Initial X position on the grid.
 * @param {number} y - Initial Y position on the grid.
 * @returns {Tetromino} The T-shaped tetromino.
 */
export const createTShape = (x: number, y: number): Tetromino => ({
  shape: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  x,
  y,
});

/**
 * Creates an L-shaped Tetromino.
 *
 * @param {number} x - Initial X position on the grid.
 * @param {number} y - Initial Y position on the grid.
 * @returns {Tetromino} The L-shaped tetromino.
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
 * Creates a J-shaped Tetromino.
 *
 * @param {number} x - Initial X position on the grid.
 * @param {number} y - Initial Y position on the grid.
 * @returns {Tetromino} The J-shaped tetromino.
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
 * Creates an S-shaped Tetromino.
 *
 * @param {number} x - Initial X position on the grid.
 * @param {number} y - Initial Y position on the grid.
 * @returns {Tetromino} The S-shaped tetromino.
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
 * Creates a Z-shaped Tetromino.
 *
 * @param {number} x - Initial X position on the grid.
 * @param {number} y - Initial Y position on the grid.
 * @returns {Tetromino} The Z-shaped tetromino.
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
 * Returns a random Tetromino shape.
 *
 * @param {number} x - Initial X position on the grid.
 * @param {number} y - Initial Y position on the grid.
 * @returns {Tetromino} A random Tetromino shape.
 */
export const createRandomShape = (x: number, y: number): Tetromino => {
  const shapeCreators = [
    createPlusShape,
    createVerticalLineShape,
    createSquareShape,
    createTShape,
    createLShape,
    createJShape,
    createSShape,
    createZShape,
  ];

  return shapeCreators[Math.floor(Math.random() * shapeCreators.length)](x, y);
};

export type Direction = 'left' | 'right' | 'up' | 'down';

/**
 * Moves a Tetromino shape left or right.
 *
 * @param {Tetromino} tetromino - The Tetromino to move.
 * @param {number} direction - The direction to move the Tetromino.
 * @returns {Tetromino} The moved Tetromino.
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
 * Rotates a Tetromino shape clockwise.
 *
 * @param {Tetromino} tetromino - The Tetromino to rotate.
 * @returns {Tetromino} The rotated Tetromino.
 */
export const rotateTetromino = (tetromino: Tetromino): Tetromino => {
  const { shape } = tetromino;
  const newShape = shape[0].map((_, i) => shape.map((row) => row[i]).reverse());

  return { ...tetromino, shape: newShape };
};

/**
 * Checks if a Tetromino shape is out of bounds.
 *
 * @param {Tetromino} tetromino - The Tetromino to check.
 * @param {number[][]} grid - The grid to check against.
 * @returns {boolean} `true` if the Tetromino is out of bounds, `false` otherwise.
 */
export const isTetrominoOutOfBounds = (
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
    }
  }
  return false;
};

/**
 * Checks if a Tetromino shape is colliding with the grid.
 *
 * @param {Tetromino} tetromino - The Tetromino to check.
 * @param {number[][]} grid - The grid to check against.
 * @returns {boolean} `true` if the Tetromino is colliding with the grid, `false` otherwise.
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

      // Check if the Tetromino is colliding with the grid
      if (grid[gridY][gridX]) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Checks if a Tetromino shape is colliding with the bottom of the grid (i.e., the floor).
 *
 * @param {Tetromino} tetromino - The Tetromino to check.
 * @param {number[][]} grid - The grid to check against.
 * @returns {boolean} `true` if the Tetromino is colliding with the bottom of the grid, `false` otherwise.
 */
export const isTetrominoBottomColliding = (
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

      if (gridY + 1 >= grid.length || grid[gridY + 1][gridX]) {
        return true;
      }
    }
  }
  return false;
};
