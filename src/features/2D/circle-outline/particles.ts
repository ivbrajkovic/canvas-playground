import random from 'lodash/random';
import { CircleOutline } from '@/features/2D/circle-outline/circle-outline';

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 400;

type Settings = {
  speed_min: number;
  speed_max: number;
  radius_min: number;
  radius_max: number;
  mass_min: number;
  mass_max: number;
  mouse_radius: number;
  particle_count: number;
};

export class Particles {
  particles: CircleOutline[] = [];
  settings: Settings = {
    speed_min: -1.0,
    speed_max: 1.0,
    radius_min: 15,
    radius_max: 35,
    mass_min: 1,
    mass_max: 3,
    mouse_radius: 200,
    particle_count: 100,
  };
  init(canvasWidth = DEFAULT_WIDTH, canvasHeight = DEFAULT_HEIGHT) {
    this.particles = Array.from({ length: this.settings.particle_count }, () => {
      const radius = random(this.settings.radius_min, this.settings.radius_max);
      const x = random(radius, canvasWidth - radius);
      const y = random(radius, canvasHeight - radius);
      const vx = random(this.settings.speed_min, this.settings.speed_max, true);
      const vy = random(this.settings.speed_min, this.settings.speed_max, true);
      const mass = random(this.settings.mass_min, this.settings.mass_max);
      const color = `hsl(${random(0, 360)}, 50%, 50%)`;
      const mouseRadius = this.settings.mouse_radius;

      // if (i > 0) {
      //     const distance = getDistanceBetweenCoords(
      //       x,
      //       y,
      //       particles[j].x,
      //       particles[j].y,
      //     );
      //     if (distance - radius * 2 < 0) {
      //       x = random(radius, canvasWidth - radius);
      //       y = random(radius, canvasHeight - radius);
      //       j = -1;
      //     }
      //   }
      // }

      return new CircleOutline(x, y, vx, vy, mass, color, radius, mouseRadius);
    });
  }
  update(mouseX: number, mouseY: number, context: CanvasRenderingContext2D) {
    this.particles.forEach((particle) => {
      particle.processMouseRadius(mouseX, mouseY);
      particle.draw(context);
      particle.move(context);
    });
  }
}
