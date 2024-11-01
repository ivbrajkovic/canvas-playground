import { rotate } from '@/lib/rotate';

/**
 * Represents a particle with position, mass, and velocity.
 */
export type Particle = {
  x: number;
  y: number;
  velocity: { x: number; y: number };
  mass: number;
};

/**
 * Resolves the collision between two particles by updating their velocities
 * based on an elastic collision reaction.
 *
 * @param particle - The first particle involved in the collision.
 * @param otherParticle - The second particle involved in the collision.
 */
export function elasticCollision(
  particle: Particle,
  otherParticle: Particle,
): void {
  // Calculate relative velocity
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  // Calculate the distance between particles
  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist < 0) return;

  // Calculate the angle of collision
  const angle = -Math.atan2(yDist, xDist);

  // Masses of the particles
  const m1 = particle.mass;
  const m2 = otherParticle.mass;
  const massSum = m1 + m2;
  const massDiff = m1 - m2;

  // Rotate velocities to the collision coordinate system
  const u1 = rotate(particle.velocity, angle);
  const u2 = rotate(otherParticle.velocity, angle);

  // Velocity after 1D collision equations
  const v1 = {
    x: (u1.x * massDiff + 2 * m2 * u2.x) / massSum,
    y: u1.y,
  };
  const v2 = {
    x: (u2.x * -massDiff + 2 * m1 * u1.x) / massSum,
    y: u2.y,
  };

  // Rotate velocities back to original coordinate system
  const vFinal1 = rotate(v1, -angle);
  const vFinal2 = rotate(v2, -angle);

  // Update particle velocities
  particle.velocity.x = vFinal1.x;
  particle.velocity.y = vFinal1.y;
  otherParticle.velocity.x = vFinal2.x;
  otherParticle.velocity.y = vFinal2.y;
}
