import { CircleCollision } from '@/app/(2D)/circle-collision/circle-collision';
import { CirclesBase } from '@/features/2D/classes/circles';
import { getDistanceBetweenCoords } from '@/lib/get-distance';
import { interpolate } from '@/lib/interpolate';

type Settings = {
  speed_min: number;
  speed_max: number;
  radius_min: number;
  radius_max: number;
  mass_min: number;
  mass_max: number;
  circle_count: number;
};

export class CircleCollisionManager extends CirclesBase {
  circles: CircleCollision[] = [];
  settings: Settings = {
    speed_min: -2.0,
    speed_max: 2.0,
    radius_min: 10,
    radius_max: 50,
    mass_min: 1,
    mass_max: 50,
    circle_count: 40,
  };

  populate = () => {
    this.circles = [];

    for (let i = 0; i < this.settings.circle_count; i++) {
      const radius = this.random(this.settings.radius_min, this.settings.radius_max);
      const { x, y } = this.placeCircleWithoutOverlap(radius);

      let vx = interpolate(
        radius,
        this.settings.radius_min - 1,
        this.settings.radius_max,
        this.settings.speed_min,
        this.settings.speed_max,
      );
      vx = this.random() < 0.5 ? -vx : vx;

      let vy = interpolate(
        radius,
        this.settings.radius_min - 1,
        this.settings.radius_max,
        this.settings.speed_min,
        this.settings.speed_max,
      );
      vy = this.random() < 0.5 ? -vy : vy;

      const mass = interpolate(
        radius,
        this.settings.radius_min,
        this.settings.radius_max,
        this.settings.mass_min,
        this.settings.mass_max,
      );

      const vector = { x: vx, y: vy };
      const color = `hsl(${this.random(360, true)}, 50%, 50%)`;

      this.circles.push(
        new CircleCollision(x, y, vector, radius, mass, color, color),
      );
    }
  };

  placeCircleWithoutOverlap(radius: number, maxAttempts = 10_000) {
    let attempts = 0;
    let x, y, isOverlapping;

    do {
      if (attempts >= maxAttempts) {
        throw new Error(
          'Cannot place circle without overlap after multiple attempts.',
        );
      }

      // Generate a new random x and y position
      x = this.random(radius, this.canvasWidth - radius);
      y = this.random(radius, this.canvasHeight - radius);
      isOverlapping = false;

      // Check if the circle overlaps with any other circle
      for (let j = 0; j < this.circles.length; j++) {
        const otherCircle = this.circles[j];
        const distance = getDistanceBetweenCoords(
          x,
          y,
          otherCircle.x,
          otherCircle.y,
          true,
        );

        // Correct the overlap check by comparing to the sum of the radii
        if (distance - radius - otherCircle.radius < 0) {
          isOverlapping = true;
          break;
        }
      }

      attempts++;
    } while (isOverlapping);

    console.log({ attempts });

    return { x, y };
  }
}
