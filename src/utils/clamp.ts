/**
 * Clamps a number between a minimum and maximum value.
 *
 * @param value - The number to clamp.
 * @param min - The minimum value to clamp to.
 * @param max - The maximum value to clamp to.
 * @returns The clamped value.
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));
