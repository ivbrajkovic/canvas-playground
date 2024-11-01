/**
 * Represents a 2D vector with x and y components.
 */
export type Vector = {
  x: number;
  y: number;
};

/**
 * Rotates a vector by a given angle.
 *
 * @param vector - The vector to rotate.
 * @param angle - The angle in radians.
 * @returns The rotated vector.
 */
export function rotate(velocity: Vector, angle: number): Vector {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: velocity.x * cos - velocity.y * sin,
    y: velocity.x * sin + velocity.y * cos,
  };
}
