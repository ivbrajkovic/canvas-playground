import random from 'lodash/random';
import { CircleOutline } from '@/app/(2D)/circle-outline/circle-outline';

export class CircleOutlineManager {
  public circles: CircleOutline[] = [];
  public circleCount = 200;
  public speedMin = -2.0;
  public speedMax = 2.0;
  public radiusMin = 20;
  public radiusMax = 40;

  public static of = (canvas: HTMLCanvasElement) => new CircleOutlineManager(canvas);

  private constructor(private canvas: HTMLCanvasElement) {
    this.populate();
  }

  public populate = () => {
    this.circles = Array.from({ length: this.circleCount }, () => {
      const radius = random(this.radiusMin, this.radiusMax);
      const x = random(radius, this.canvas.width - radius);
      const y = random(radius, this.canvas.height - radius);
      const vx = random(this.speedMin, this.speedMax, true);
      const vy = random(this.speedMin, this.speedMax, true);
      const vector = { x: vx, y: vy };
      const color = `hsl(${random(0, 360)}, 50%, 50%)`;
      return new CircleOutline(x, y, vector, color, radius);
    });
  };
}
