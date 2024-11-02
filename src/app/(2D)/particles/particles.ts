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

  init(
    canvasWidth = this.defaultCanvasWidth,
    canvasHeight = this.defaultCanvasHeight,
  ): void {
    throw new Error('Method not implemented.');
  }

  update(...args: unknown[]): void {
    throw new Error('Method not implemented.');
  }
}
