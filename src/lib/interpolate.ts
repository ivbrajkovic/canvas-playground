/**
 * Interpolates a value within a given range.
 *
 * This function takes a value `x` and maps it from the range `[xMin, xMax]`
 * to the range `[yMin, yMax]`. It performs a linear interpolation.
 *
 * @param x - The value to interpolate.
 * @param xMin - The minimum value of the input range.
 * @param xMax - The maximum value of the input range.
 * @param yMin - The minimum value of the output range.
 * @param yMax - The maximum value of the output range.
 * @returns The interpolated value within the output range.
 */
export function interpolate(
  x: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
): number {
  return yMin + ((x - xMin) / (xMax - xMin)) * (yMax - yMin);
}
