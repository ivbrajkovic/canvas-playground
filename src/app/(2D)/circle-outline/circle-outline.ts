import { Circle, Vec2 } from '@/features/2D/classes/circle';
import { getDistanceBetweenCoords } from '@/lib/get-distance';

export class CircleOutline extends Circle {
  opacity: number;
  mouseRadius: number;

  #getDistanceBetweenCoords: (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    precise?: boolean,
  ) => number;

  constructor(
    x: number,
    y: number,
    vector: Vec2,
    color: string,
    mass: number,
    radius: number,
    mouseRadius: number,
    getDistanceBetweenCoordsFn = getDistanceBetweenCoords,
  ) {
    super(x, y, vector, radius, 1, color, color);
    this.opacity = 0;
    this.mouseRadius = mouseRadius;
    this.#getDistanceBetweenCoords = getDistanceBetweenCoordsFn;
  }

  processMouseRadius(mouseX: number, mouseY: number): void {
    const distance = this.getDistanceFromCoords(mouseX, mouseY, true);
    if (distance < this.mouseRadius && this.opacity <= 0.2) {
      // const opacity = 1 - distance / this.mouseRadius;
      const newOpacity = this.opacity + 0.01;
      this.opacity = newOpacity > 1 ? 1 : newOpacity;
    } else if (this.opacity > 0) {
      const newOpacity = this.opacity - 0.01;
      this.opacity = newOpacity < 0 ? 0 : newOpacity;
    }
  }
}
