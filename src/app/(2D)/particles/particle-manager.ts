import { Particle } from '@/app/(2D)/particles/particle';
import random from 'lodash/random';

type Settings = {
  vector_min: number;
  vector_max: number;
  radius_min: number;
  radius_max: number;
  particle_density: number;
  particle_count: number;
  particle_color: string;
  line_color: string;
  mouse_radius: number;
};

export class ParticleManager {
  canvasWidth = 600;
  canvasHeight = 400;
  circles: Particle[] = [];
  settings: Settings = {
    vector_min: -2.0,
    vector_max: 2.0,
    radius_min: 1,
    radius_max: 3,
    particle_density: 10,
    particle_color: '#ffffff',
    line_color: '#ffffff',
    particle_count: 100,
    mouse_radius: 200,
  };

  init(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.populate();
  }

  populate() {
    this.circles = Array.from({ length: this.settings.particle_count }, () => {
      const radius = random(this.settings.radius_min, this.settings.radius_max);
      const x = random(radius, this.canvasWidth - radius);
      const y = random(radius, this.canvasHeight - radius);
      const vx = random(this.settings.vector_min, this.settings.vector_max, true);
      const vy = random(this.settings.vector_min, this.settings.vector_max, true);
      const vector = { x: vx, y: vy };
      const color = this.settings.particle_color;
      const density = this.settings.particle_density;
      const line = {
        distance: 100,
        color: '#ffffff',
        opacity: 0.1,
        width: 1,
      };
      return new Particle(x, y, vector, color, radius, density, line);
    });
  }
}
