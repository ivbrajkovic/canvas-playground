import random from 'lodash/random';

import { CircleCollision } from '@/app/(2D)/circle-collision/circle-collision';
import { interpolate } from '@/lib/interpolate';
import { getDistanceBetweenCoords } from '@/lib/get-distance';
import { findNonOverlappingPosition } from '@/utils/find-radial-position';

export class CircleCollisionManager {
  public circles: CircleCollision[] = [];
  public speedMin = -2.0;
  public speedMax = 2.0;
  public radiusMin = 10;
  public radiusMax = 50;
  public massMin = 1;
  public massMax = 50;
  public circleCount = 40;

  public static of = (canvas: HTMLCanvasElement) =>
    new CircleCollisionManager(canvas);

  private constructor(private canvas: HTMLCanvasElement) {
    this.populate();
  }

  private findNonOverlappingPosition = (
    width: number,
    height: number,
    radius: number,
  ) => {
    return findNonOverlappingPosition(
      width,
      height,
      radius,
      this.circles,
      getDistanceBetweenCoords,
      random,
    );
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

  private calculateMass = (radius: number) => {
    return interpolate(
      radius,
      this.radiusMin,
      this.radiusMax,
      this.massMin,
      this.massMax,
    );
  };

  populate = () => {
    const { width, height } = this.canvas;
    this.circles = Array.from({ length: this.circleCount }, () => {
      const radius = random(this.radiusMin, this.radiusMax);
      const { x, y } = this.findNonOverlappingPosition(width, height, radius);
      const vector = {
        x: this.calculateVelocity(radius),
        y: this.calculateVelocity(radius),
      };
      const mass = this.calculateMass(radius);
      const color = `hsl(${random(360, true)}, 50%, 50%)`;
      return new CircleCollision(x, y, vector, radius, 1, color, color, mass);
    });
    return this;
  };
}
