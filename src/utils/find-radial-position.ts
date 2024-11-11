import random from 'lodash/random';

import { getDistanceBetweenCoords } from '@/utils/distance';

const DEFAULT_MAX_ATTEMPTS = 10_000;

type RadialPoint = {
  x: number;
  y: number;
  radius: number;
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
  maxAttempts = DEFAULT_MAX_ATTEMPTS,
): { x: number; y: number } => {
  const initialAttempts = maxAttempts;

  while (--maxAttempts) {
    const x = random(radius, width - radius);
    const y = random(radius, height - radius);

    const isOverlapping = items.some((item) => {
      const distance = getDistanceBetweenCoords(x, y, item.x, item.y);
      return distance < radius + item.radius;
    });
    if (!isOverlapping) return { x, y };
  }

  throw new Error(
    `Cannot place item without overlap after ${initialAttempts} attempts.`,
  );
};
