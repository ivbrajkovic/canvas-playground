/**
 * Represents a point in 2D space
 */
export type Point2D = {
  x: number;
  y: number;
};

/**
 * Calculates the Euclidean distance between two points in 2D space
 * @param point1 - The first point coordinates
 * @param point2 - The second point coordinates
 * @returns The distance between the two points
 * @example
 * const p1 = { x: 0, y: 0 };
 * const p2 = { x: 3, y: 4 };
 * const distance = getDistance(p1, p2); // returns 5
 */
export function getDistance(point1: Point2D, point2: Point2D): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates the Euclidean distance between two points given their coordinates
 * @param x1 - X coordinate of the first point
 * @param y1 - Y coordinate of the first point
 * @param x2 - X coordinate of the second point
 * @param y2 - Y coordinate of the second point
 * @returns The distance between the two points
 * @example
 * const distance = getDistanceFromCoordinates(0, 0, 3, 4); // returns 5
 */
export function getDistanceFromCoordinates(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  return getDistance({ x: x1, y: y1 }, { x: x2, y: y2 });
}
