import { Circle, Vec2 } from '@/features/2D/classes/circle';

export class CircleOutline extends Circle {
  opacity: number;
  mouseRadius: number;

  constructor(
    x: number,
    y: number,
    vector: Vec2,
    color: string,
    radius: number,
    mouseRadius: number,
  ) {
    super(x, y, vector, radius, 1, color, color);
    this.opacity = 0;
    this.mouseRadius = mouseRadius;
  }

  processMouseRadius(mouseX: number, mouseY: number): void {
    const distance = this.getDistanceFromCoords(mouseX, mouseY, true);

    if (distance < this.mouseRadius && this.opacity < 1) {
      this.opacity = Math.min(1, this.opacity + 0.1);
    } else if (this.opacity > 0) {
      this.opacity = Math.max(0, this.opacity - 0.1);
    }
  }
}
