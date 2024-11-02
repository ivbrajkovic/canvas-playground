import { Circle } from '@/features/2D/classes/circle';
import { CircleBase } from '@/features/2D/classes/circles';

type Settings = {
  speed_min: number;
  speed_max: number;
  radius_min: number;
  radius_max: number;
  mouse_radius: number;
  particles_count: number;
};

export class Particles extends CircleBase {
  circles: Circle[] = [];
  settings: Settings = {
    speed_min: -2.0,
    speed_max: 2.0,
    radius_min: 15,
    radius_max: 35,
    mouse_radius: 200,
    particles_count: 80,
  };

  populate(
    canvasWidth = this.defaultCanvasWidth,
    canvasHeight = this.defaultCanvasHeight,
  ): void {
    this.circles = Array.from({ length: this.settings.particles_count }, () => {
      const radius = this.random(this.settings.radius_min, this.settings.radius_max);
      const x = this.random(radius, canvasWidth - radius);
      const y = this.random(radius, canvasHeight - radius);
      const vx = this.random(this.settings.speed_min, this.settings.speed_max, true);
      const vy = this.random(this.settings.speed_min, this.settings.speed_max, true);
      const vector = { x: vx, y: vy };
      const color = `hsl(${this.random(0, 360)}, 50%, 50%)`;

      return new Circle(x, y, vector, radius, 1, color, color);
    });
  }

  render(...args: unknown[]): void {
    throw new Error('Method not implemented.');
  }
}
