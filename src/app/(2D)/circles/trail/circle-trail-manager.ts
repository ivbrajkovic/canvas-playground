import { Circle } from '@/classes/circle';
import random from 'lodash/random';

type Settings = {
  speedMin?: number;
  speedMax?: number;
  radiusMin?: number;
  radiusMax?: number;
  circleCount?: number;
};

export class CircleTrailManager {
  private _circles: Circle[] = [];

  public circleCount = 80;
  public speedMin = -2.0;
  public speedMax = 2.0;
  public radiusMin = 15;
  public radiusMax = 35;
  public trail = 0.1;

  constructor(settings: Settings) {
    this.setSettings(settings);
  }

  setSettings = (settings: Settings) => {
    this.circleCount = settings.circleCount ?? this.circleCount;
    this.speedMin = settings.speedMin ?? this.speedMin;
    this.speedMax = settings.speedMax ?? this.speedMax;
    this.radiusMin = settings.radiusMin ?? this.radiusMin;
    this.radiusMax = settings.radiusMax ?? this.radiusMax;
    return this;
  };

  public populate = (width: number, height: number) => {
    this._circles = Array.from({ length: this.circleCount }, () => {
      const radius = random(this.radiusMin, this.radiusMax);
      const x = random(radius, width - radius);
      const y = random(radius, height - radius);
      const vx = random(this.speedMin, this.speedMax, true);
      const vy = random(this.speedMin, this.speedMax, true);
      const vector = { x: vx, y: vy };
      const color = `hsl(${random(360, true)}, 50%, 50%)`;
      return new Circle(x, y, vector, radius, 1, color, color);
    });
    return this;
  };

  public draw = (
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => {
    context.fillStyle = `hsla(0, 0%, 0%, ${this.trail})`;
    context.fillRect(0, 0, width, height);
    this._circles.forEach((circle) => {
      circle.move(width, height);
      circle.draw(context);
    });
  };
}
