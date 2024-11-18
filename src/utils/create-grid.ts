/**
 * Creates a 2D grid represented as a nested array with specified dimensions.
 *
 * @param width - The number of columns in the grid
 * @param height - The number of rows in the grid
 * @param defaultValue - The value to fill the grid with (defaults to 0)
 * @returns A 2D array of dimensions height x width filled with the defaultValue
 *
 * @example
 * ```typescript
 * // Creates a 3x2 grid filled with zeros
 * const grid = createGrid(3, 2); // [[0,0,0], [0,0,0]]
 *
 * // Creates a 2x2 grid filled with ones
 * const grid = createGrid(2, 2, 1); // [[1,1], [1,1]]
 * ```
 */
export const createGrid = (width: number, height: number, defaultValue = 0) => {
  return Array.from({ length: height }, () => Array(width).fill(defaultValue));
};
