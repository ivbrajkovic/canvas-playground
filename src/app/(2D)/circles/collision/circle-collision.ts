import { Circle, Vec2 } from '@/classes/circle';
import { getDistanceBetweenCoords } from '@/utils/distance';
import { elasticCollision } from '@/utils/elastic-collision';

export class CircleCollision extends Circle {
  constructor(
    public x: number,
    public y: number,
    public vector: Vec2,
    public radius: number,
    public opacity: number,
    public fillColor: string,
    public strokeColor: string,

    // Additional properties for collision detection
    public mass: number,
  ) {
    super(x, y, vector, radius, opacity, fillColor, strokeColor);
  }

  update(circles: CircleCollision[]): void {
    for (let i = 0; i < circles.length; i++) {
      if (this === circles[i]) continue;

      const distance = getDistanceBetweenCoords(
        this.x,
        this.y,
        circles[i].x,
        circles[i].y,
        true,
      );
      if (distance - this.radius - circles[i].radius > 0) continue;

      elasticCollision(this, circles[i]);
    }
  }
}
