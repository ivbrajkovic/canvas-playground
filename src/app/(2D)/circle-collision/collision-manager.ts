import random from 'lodash/random';

import { CircleCollision } from '@/app/(2D)/circle-collision/circle-collision';
import { interpolate } from '@/utils/interpolate';
import { findNonOverlappingPosition as _findNonOverlappingPosition } from '@/utils/find-radial-position';
import { CanvasController } from '@/controllers/canvas-controller';

type Settings = {
  speedMin?: number;
  speedMax?: number;
  radiusMin?: number;
  radiusMax?: number;
  massMin?: number;
  massMax?: number;
  circleCount?: number;
};

export class CircleCollisionManager {
  private _canvasController: CanvasController;
  private _circles: CircleCollision[] = [];

  public speedMin = -2.0;
  public speedMax = 2.0;
  public radiusMin = 10;
  public radiusMax = 50;
  public massMin = 1;
  public massMax = 50;
  public circleCount = 40;

  public static of = (canvasController: CanvasController, settings: Settings) =>
    new CircleCollisionManager(canvasController, settings);

  constructor(canvasController: CanvasController, settings: Settings) {
    this._canvasController = canvasController;
    Object.assign(this, settings);
    this.populate();
  }

  private _findNonOverlappingPosition = (
    width: number,
    height: number,
    radius: number,
  ) => {
    return _findNonOverlappingPosition(width, height, radius, this._circles);
  };

  private calculateVelocity(radius: number) {
    const velocity = interpolate(
      radius,
      this.radiusMin,
      this.radiusMax,
      this.speedMin,
      this.speedMax,
    );
    return random(0, 1, true) < 0.5 ? -velocity : velocity;
  }

  private _calculateMass = (radius: number) => {
    return interpolate(
      radius,
      this.radiusMin,
      this.radiusMax,
      this.massMin,
      this.massMax,
    );
  };

  public populate = () => {
    const { width, height } = this._canvasController;
    this._circles.length = 0;

    Array.from({ length: this.circleCount }).forEach(() => {
      const radius = random(this.radiusMin, this.radiusMax);
      const { x, y } = this._findNonOverlappingPosition(width, height, radius);
      const vector = {
        x: this.calculateVelocity(radius),
        y: this.calculateVelocity(radius),
      };
      const mass = this._calculateMass(radius);
      const color = `hsl(${random(360, true)}, 50%, 50%)`;
      this._circles.push(
        new CircleCollision(x, y, vector, radius, 1, color, color, mass),
      );
    });

    return this;
  };

  public animate = () => {
    const { width, height, context } = this._canvasController;
    this._circles.forEach((circle) => {
      circle.update(this._circles);
      circle.move(width, height);
      circle.draw(context);
    });
  };
}
