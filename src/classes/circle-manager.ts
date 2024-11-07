import random from 'lodash/random';
import { CircleOutline } from '@/app/(2D)/circle-outline/circle-outline';

type Settings = {
  circleCount?: number;
  speedMin?: number;
  speedMax?: number;
  radiusMin?: number;
  radiusMax?: number;
};

export class CircleManager {
  public circles: CircleOutline[] = [];
  public circleCount;
  public speedMin;
  public speedMax;
  public radiusMin;
  public radiusMax;

  public static of = (canvas: HTMLCanvasElement, settings?: Settings) =>
    new CircleManager(canvas, settings);

  private constructor(private canvas: HTMLCanvasElement, settings?: Settings) {
    this.circleCount = settings?.circleCount ?? 100;
    this.speedMin = settings?.speedMin ?? -1.0;
    this.speedMax = settings?.speedMax ?? 1.0;
    this.radiusMin = settings?.radiusMin ?? 10;
    this.radiusMax = settings?.radiusMax ?? 50;
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
