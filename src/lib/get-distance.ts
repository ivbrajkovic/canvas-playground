/**
 * Represents a point in 2D space
 */
export type Point2D = {
  x: number;
  y: number;
};

/**
 * Calculates the squared Euclidean distance between two points given their coordinates.
 * Optionally computes the precise distance using Math.sqrt.
 * @param x1 - X coordinate of the first point
 * @param y1 - Y coordinate of the first point
 * @param x2 - X coordinate of the second point
 * @param y2 - Y coordinate of the second point
 * @param precise - Optional flag to compute precise distance; defaults to false (returns squared distance)
 * @returns The squared distance or precise distance between the two points
 * @example
 * const distanceSquared = getDistanceBetweenCoords(0, 0, 3, 4); // returns 25
 * const distance = getDistanceBetweenCoords(0, 0, 3, 4, true); // returns 5
 */
export function getDistanceBetweenCoords(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  precise: boolean = false,
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distSquared = dx * dx + dy * dy;
  return precise ? Math.sqrt(distSquared) : distSquared;
}

/**
 * Calculates the squared Euclidean distance between two Point2D objects.
 * Optionally computes the precise distance using Math.sqrt.
 * @param point1 - The first point coordinates
 * @param point2 - The second point coordinates
 * @param precise - Optional flag to compute precise distance; defaults to false (returns squared distance)
 * @returns The squared distance or precise distance between the two points
 * @example
 * const p1 = { x: 0, y: 0 };
 * const p2 = { x: 3, y: 4 };
 * const distanceSquared = getDistanceBetweenPoints(p1, p2); // returns 25
 * const distance = getDistanceBetweenPoints(p1, p2, true); // returns 5
 */
export function getDistanceBetweenPoints(
  point1: Point2D,
  point2: Point2D,
  precise: boolean = false,
): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  const distSquared = dx * dx + dy * dy;
  return precise ? Math.sqrt(distSquared) : distSquared;
}
