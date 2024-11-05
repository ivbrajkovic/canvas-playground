import random from 'lodash/random';

import { CircleCollision } from '@/app/(2D)/circle-collision/circle-collision';
import { interpolate } from '@/lib/interpolate';

export class CircleCollisionManager {
  canvasWidth = 600;
  canvasHeight = 400;
  circles: CircleCollision[] = [];
  settings = {
    speedMin: -2.0,
    speedMax: 2.0,
    radiusMin: 10,
    radiusMax: 50,
    massMin: 1,
    massMax: 50,
    circleCount: 40,
  };

  init(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.populate();
  }

  populate = () => {
    this.circles = [];

    for (let i = 0; i < this.settings.circleCount; i++) {
      const radius = random(this.settings.radiusMin, this.settings.radiusMax);
      const { x, y } = this.placeCircleWithoutOverlap(radius);

      let vx = interpolate(
        radius,
        this.settings.radiusMin - 1,
        this.settings.radiusMax,
        this.settings.speedMin,
        this.settings.speedMax,
      );
      vx = random() < 0.5 ? -vx : vx;

      let vy = interpolate(
        radius,
        this.settings.radiusMin - 1,
        this.settings.radiusMax,
        this.settings.speedMin,
        this.settings.speedMax,
      );
      vy = random() < 0.5 ? -vy : vy;

      const mass = interpolate(
        radius,
        this.settings.radiusMin,
        this.settings.radiusMax,
        this.settings.massMin,
        this.settings.massMax,
      );

      const vector = { x: vx, y: vy };
      const color = `hsl(${random(360, true)}, 50%, 50%)`;

      this.circles.push(new CircleCollision(x, y, vector, radius, mass, color, color));
    }
  };

  placeCircleWithoutOverlap(radius: number, maxAttempts = 10_000) {
    let attempts = 0;
    let x, y, isOverlapping;

    do {
      if (attempts >= maxAttempts)
        throw new Error('Cannot place circle without overlap after multiple attempts.');

      // Generate a new random x and y position
      x = random(radius, this.canvasWidth - radius);
      y = random(radius, this.canvasHeight - radius);
      isOverlapping = false;

      // Check if the circle overlaps with any other circle
      for (let j = 0; j < this.circles.length; j++) {
        const otherCircle = this.circles[j];
        const distance = otherCircle.getDistanceFromCoords(x, y, true);

        // Correct the overlap check by comparing to the sum of the radii
        if (distance - radius - otherCircle.radius < 0) {
          isOverlapping = true;
          break;
        }
      }

      attempts++;
    } while (isOverlapping);

    return { x, y };
  }
}
