import { Circle } from '@/features/2D/classes/circle';
import { CircleBase } from '@/features/2D/classes/circles';
import random from 'lodash/random';

type Settings = {
  speed_min: number;
  speed_max: number;
  radius_min: number;
  radius_max: number;
  circle_count: number;
};

export class Circles extends CircleBase {
  balls: Circle[] = [];
  settings: Settings = {
    speed_min: -2.0,
    speed_max: 2.0,
    radius_min: 15,
    radius_max: 35,
    circle_count: 80,
  };
  init(
    canvasWidth = this.defaultCanvasWidth,
    canvasHeight = this.defaultCanvasHeight,
  ) {
    this.balls = Array.from({ length: this.settings.circle_count }, () => {
      const radius = random(this.settings.radius_min, this.settings.radius_max);
      const x = random(radius, canvasWidth - radius);
      const y = random(radius, canvasHeight - radius);
      const vx = random(this.settings.speed_min, this.settings.speed_max, true);
      const vy = random(this.settings.speed_min, this.settings.speed_max, true);
      const vector = { x: vx, y: vy };
      const color = `hsl(${random(360, true)}, 50%, 50%)`;
      return new Circle(x, y, vector, radius, 1, color, color);
    });
  }
  update(context: CanvasRenderingContext2D) {
    this.balls.forEach((ball) => {
      ball.move(context);
      ball.draw(context);
    });
  }
}
