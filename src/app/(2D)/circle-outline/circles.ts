import random from 'lodash/random';
import { CircleOutline } from '@/app/(2D)/circle-outline/circle-outline';
import { CircleBase } from '@/features/2D/classes/circles';
// import { getDistanceBetweenCoords } from '@/lib/get-distance';

type Settings = {
  speed_min: number;
  speed_max: number;
  radius_min: number;
  radius_max: number;
  mass_min: number;
  mass_max: number;
  mouse_radius: number;
  circle_count: number;
};

export class Circles extends CircleBase {
  circles: CircleOutline[] = [];
  settings: Settings = {
    speed_min: -2.0,
    speed_max: 2.0,
    radius_min: 15,
    radius_max: 35,
    mass_min: 1,
    mass_max: 3,
    mouse_radius: 200,
    circle_count: 80,
  };
  init(
    canvasWidth = this.defaultCanvasWidth,
    canvasHeight = this.defaultCanvasHeight,
  ) {
    this.circles = Array.from({ length: this.settings.circle_count }, () => {
      const radius = random(this.settings.radius_min, this.settings.radius_max);
      const x = random(radius, canvasWidth - radius);
      const y = random(radius, canvasHeight - radius);
      const vx = random(this.settings.speed_min, this.settings.speed_max, true);
      const vy = random(this.settings.speed_min, this.settings.speed_max, true);
      const vector = { x: vx, y: vy };
      const mass = random(this.settings.mass_min, this.settings.mass_max);
      const color = `hsl(${random(0, 360)}, 50%, 50%)`;
      const mouseRadius = this.settings.mouse_radius;

      // if (i > 0) {
      //   for (let j = 0; j < this.particles.length; j++) {
      //     const distance = getDistanceBetweenCoords(
      //       x,
      //       y,
      //       this.particles[j].x,
      //       this.particles[j].y,
      //     );
      //     if (distance - radius * 2 < 0) {
      //       x = random(radius, canvasWidth - radius);
      //       y = random(radius, canvasHeight - radius);
      //       j = -1;
      //     }
      //   }
      // }

      return new CircleOutline(x, y, vector, color, mass, radius, mouseRadius);
    });
  }
  update(mouseX: number, mouseY: number, context: CanvasRenderingContext2D) {
    this.circles.forEach((particle) => {
      particle.processMouseRadius(mouseX, mouseY);
      // particle.processCircleCollisions(this.particles);
      particle.move(context);
      particle.draw(context);
    });
  }
}
