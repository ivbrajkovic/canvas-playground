import { Tetromino } from '@/app/(2D)/games/tetris/tetromino';

export const isCollision = (tetromino: Tetromino, grid: number[][]) => {
  const { shape, x, y } = tetromino;
  const rowLength = shape.length;
  const columnLength = shape[0].length;

  for (let row = 0; row < rowLength; row++) {
    for (let col = 0; col < columnLength; col++) {
      if (shape[row][col] === 0) continue;

      const gridX = x + col;
      const gridY = y + row;

      // Check if the tetromino is outside the grid
      if (gridX < 0 || gridX >= grid[0].length || gridY < 0 || gridY >= grid.length) {
        return true;
      }

      // Check if the tetromino is colliding with the grid
      if (grid[gridY][gridX]) {
        return true;
      }
    }
  }

  return false;
};

export const isBottomCollision = (tetromino: Tetromino, grid: number[][]) => {
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
