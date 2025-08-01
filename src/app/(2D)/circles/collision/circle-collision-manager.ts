import random from 'lodash/random';

import { CircleCollision } from '@/app/(2D)/circles/collision/circle-collision';
import { findNonOverlappingPosition as _findNonOverlappingPosition } from '@/utils/find-radial-position';
import { interpolate } from '@/utils/interpolate';

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
  private _circles: CircleCollision[] = [];

  public speedMin = -2.0;
  public speedMax = 2.0;
  public radiusMin = 10;
  public radiusMax = 50;
  public massMin = 1;
  public massMax = 50;
  public circleCount = 40;

  constructor(settings: Settings) {
    this.setSettings(settings);
  }

  private _findNonOverlappingPosition = (
    width: number,
    height: number,
    radius: number,
  ) => {
    return _findNonOverlappingPosition(width, height, radius, this._circles);
  };

  private _calculateVelocity(radius: number) {
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

  public setSettings = (settings: Settings) => {
    this.speedMin = settings.speedMin ?? this.speedMin;
    this.speedMax = settings.speedMax ?? this.speedMax;
    this.radiusMin = settings.radiusMin ?? this.radiusMin;
    this.radiusMax = settings.radiusMax ?? this.radiusMax;
    this.massMin = settings.massMin ?? this.massMin;
    this.massMax = settings.massMax ?? this.massMax;
    this.circleCount = settings.circleCount ?? this.circleCount;

    return this;
  };

  public populate = (width: number, height: number) => {
    this._circles.length = 0;

    Array.from({ length: this.circleCount }).forEach(() => {
      const radius = random(this.radiusMin, this.radiusMax);
      const { x, y } = this._findNonOverlappingPosition(width, height, radius);
      const vector = {
        x: this._calculateVelocity(radius),
        y: this._calculateVelocity(radius),
      };
      const mass = this._calculateMass(radius);
      const color = `hsl(${random(360, true)}, 50%, 50%)`;
      this._circles.push(
        new CircleCollision(x, y, vector, radius, 1, color, color, mass),
      );
    });

    return this;
  };

  public draw = (
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => {
    context.fillStyle = `hsl(0, 0%, 10%)`;
    context.fillRect(0, 0, width, height);

    this._circles.forEach((circle) => {
      circle.update(this._circles);
      circle.move(width, height);
      circle.draw(context);
    });
  };
}
