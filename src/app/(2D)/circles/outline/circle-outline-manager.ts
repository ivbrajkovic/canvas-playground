import { CircleOutline } from '@/app/(2D)/circles/outline/circle-outline';
import random from 'lodash/random';

type Settings = {
  speedMin?: number;
  speedMax?: number;
  radiusMin?: number;
  radiusMax?: number;
  circleCount?: number;
};

export class CircleOutlineManager {
  private _circles: CircleOutline[] = [];

  public circleCount = 200;
  public speedMin = -2.0;
  public speedMax = 2.0;
  public radiusMin = 20;
  public radiusMax = 40;

  constructor(settings: Settings) {
    this.setSettings(settings);
  }

  public setSettings = (settings: Settings) => {
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
      const color = `hsl(${random(0, 360)}, 50%, 50%)`;
      return new CircleOutline(x, y, vector, color, radius);
    });
    return this;
  };

  draw = (context: CanvasRenderingContext2D, width: number, height: number) => {
    context.fillStyle = `hsl(0, 0%, 10%)`;
    context.fillRect(0, 0, width, height);
    this._circles.forEach((circle) => {
      circle.move(width, height);
      circle.draw(context);
    });
  };

  respondToForces = (x: number, y: number, radius: number) => {
    this._circles.forEach((circle) => {
      circle.respondToForces(x, y, radius);
    });
  };
}
