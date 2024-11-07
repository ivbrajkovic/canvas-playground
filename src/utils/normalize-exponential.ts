/**
 * Normalizes a value using an exponential transformation with a given factor k.
 * This function applies an inverse exponential transformation to create a non-linear mapping
 * between input and output values, while maintaining the [0,1] range.
 *
 * @param x - The input value to normalize (must be between 0 and 1 inclusive)
 * @param k - The exponential factor that controls the curve's steepness
 * @returns The normalized value between 0 and 1
 * @throws {RangeError} When input x is not between 0 and 1
 *
 * @example
 * ```ts
 * normalizeExponential(0.5, 2); // Returns a value between 0 and 1
 * ```
 */
export const normalizeExponential = (x: number, k: number) => {
  if (x < 0 || x > 1) throw new RangeError('Input x must be between 0 and 1.');

  // Handle edge cases to avoid Math.log(0)
  if (x === 0) return 0;
  if (x === 1) return 1;

  // Apply the inverse exponential transformation
  const normalized = Math.log(x * (Math.exp(k) - 1) + 1) / k;
  return normalized;
};
