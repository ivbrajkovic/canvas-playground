/**
 * Linearly interpolates between two numbers `a` and `b` based on a parameter `t`.
 * The parameter `t` is clamped between 0 and 1 to ensure the result is within the range of `a` and `b`.
 *
 * @param a - The start value.
 * @param b - The end value.
 * @param t - The interpolation factor, typically between 0 and 1.
 * @returns The interpolated value between `a` and `b`.
 */
export function extrapolate(a: number, b: number, t: number): number {
  t = Math.max(0, Math.min(1, t));
  return a + (b - a) * t;
}
