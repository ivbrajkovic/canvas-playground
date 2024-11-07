import random from 'lodash/random';
import { Circle } from '@/classes/circle';

export class CircleTrailManager {
  public circles: Circle[] = [];
  public circleCount = 80;
  public speedMin = -2.0;
  public speedMax = 2.0;
  public radiusMin = 15;
  public radiusMax = 35;

  static of = (canvas: HTMLCanvasElement) => new CircleTrailManager(canvas);

  constructor(private canvas: HTMLCanvasElement) {
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
      const color = `hsl(${random(360, true)}, 50%, 50%)`;
      return new Circle(x, y, vector, radius, 1, color, color);
    });
  };
}
