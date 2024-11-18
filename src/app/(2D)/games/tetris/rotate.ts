import { isCollision } from '@/app/(2D)/games/tetris/is-collision';
import { Tetromino } from '@/app/(2D)/games/tetris/tetromino';

export const rotateClockwise = (tetromino: Tetromino, grid: number[][]) => {
  const { shape } = tetromino;
  // Rotate the shape 90 degrees clockwise
  const newShape = shape[0].map((_, i) => shape.map((row) => row[i]).reverse());

  // if the new shape is colliding with the grid, return the original tetromino
  if (isCollision({ ...tetromino, shape: newShape }, grid)) return tetromino;

  // otherwise, return the tetromino with the new shape
  return { ...tetromino, shape: newShape };
};
