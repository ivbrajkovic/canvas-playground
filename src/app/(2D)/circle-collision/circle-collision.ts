import { Circle } from '@/features/2D/classes/circle';
import { elasticCollision } from '@/lib/elastic-collision';

export class CircleCollision extends Circle {
  mass: number;

  constructor(
    x: number,
    y: number,
    vector: { x: number; y: number },
    radius: number,
    mass: number,
    color: string,
    borderColor: string,
  ) {
    super(x, y, vector, radius, mass, color, borderColor);
    this.mass = mass;
  }

  processCircleCollisions(circles: CircleCollision[]): void {
    for (let i = 0; i < circles.length; i++) {
      if (this === circles[i]) continue;

      const distance = this.getDistanceFromCoords(circles[i].x, circles[i].y, true);
      if (distance - this.radius - circles[i].radius <= 0) {
        elasticCollision(this, circles[i]);
      }
    }
  }
}
