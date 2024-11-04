import { Circle, Vec2 } from '@/features/2D/classes/circle';

export class CircleOutline extends Circle {
  constructor(
    x: number,
    y: number,
    vector: Vec2,
    color: string,
    radius: number,
  ) {
    super(x, y, vector, radius, 1, color, color);
    this.opacity = 0;
  }

  respondToForces(
    targetX: number,
    targetY: number,
    targetRadius: number,
  ): void {
    const distance = this.getDistanceFromCoords(targetX, targetY, true);
    const opacity = this.opacity;

    if (distance < targetRadius && this.opacity < 1) {
      this.opacity = Math.min(1, opacity + 0.1);
    } else if (opacity > 0) {
      this.opacity = Math.max(0, opacity - 0.1);
    }
  }
}
