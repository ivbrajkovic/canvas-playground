const DEFAULT_MAX_ATTEMPTS = 10_000;

type RadialPoint = {
  x: number;
  y: number;
  radius: number;
};

/**
 * Determines if a point with given coordinates and radius overlaps with another radial point.
 *
 * @template T - Type extending RadialPoint interface
 * @param x - X coordinate of the first point
 * @param y - Y coordinate of the first point
 * @param radius - Radius of the first point
 * @param item - Second radial point to check overlap with
 * @param distanceFunc - Function to calculate distance between two points
 * @returns Boolean indicating whether the points overlap
 */
const isOverlappingFunc = <T extends RadialPoint>(
  x: number,
  y: number,
  radius: number,
  item: T,
  distanceFunc: (x1: number, y1: number, x2: number, y2: number) => number,
): boolean => {
  const distance = distanceFunc(x, y, item.x, item.y);
  const minDistance = radius + item.radius;
  return distance < minDistance;
};

/**
 * Finds a non-overlapping position for a new item within a specified area.
 *
 * @param width - The width of the area to place the item in
 * @param height - The height of the area to place the item in
 * @param radius - The radius around the position to check for overlaps
 * @param items - Array of existing items to check against for overlap
 * @param distanceFunc - Function that determines the distance between two points
 * @param randomFunc - Function to generate random numbers within a range
 * @param maxAttempts - Maximum number of attempts to find a non-overlapping position
 *
 * @returns An object containing x and y coordinates of the non-overlapping position
 * @throws {Error} If a non-overlapping position cannot be found within the maximum attempts
 *
 * @typeParam T - The type of items in the array to check against
 */
export const findNonOverlappingPosition = <T extends RadialPoint>(
  width: number,
  height: number,
  radius: number,
  items: T[],
  distanceFunc: (x1: number, y1: number, x2: number, y2: number) => number,
  randomFunc: (min: number, max: number) => number,
  maxAttempts = DEFAULT_MAX_ATTEMPTS,
): { x: number; y: number } => {
  const initialAttempts = maxAttempts;

  while (--maxAttempts) {
    const x = randomFunc(radius, width - radius);
    const y = randomFunc(radius, height - radius);

    const isOverlapping = items.some((item) => {
      isOverlappingFunc(x, y, radius, item, distanceFunc);
    });
    if (!isOverlapping) return { x, y };
  }

  throw new Error(
    `Cannot place item without overlap after ${initialAttempts} attempts.`,
  );
};
