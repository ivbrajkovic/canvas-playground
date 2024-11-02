import { Circle } from '@/features/2D/classes/circle';

export class Particle extends Circle {
  constructor(
    x: number,
    y: number,
    vector: { x: number; y: number },
    radius: number,
    mass: number,
    color: string,
    strokeColor: string,
  ) {
    super(x, y, vector, radius, mass, color, strokeColor);
  }
}
