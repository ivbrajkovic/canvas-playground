import random from 'lodash/random';

import { BouncingBall } from '@/features/2D/bouncing-balls/bouncing-ball';

type Settings = {
  speed_min: number;
  speed_max: number;
  radius_min: number;
  radius_max: number;
  balls_count: number;
};

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 400;

export class BouncingBalls {
  balls: BouncingBall[] = [];
  settings: Settings = {
    speed_min: -3.0,
    speed_max: 3.0,
    radius_min: 15,
    radius_max: 35,
    balls_count: 20,
  };
  init(canvasWidth = DEFAULT_WIDTH, canvasHeight = DEFAULT_HEIGHT) {
    this.balls = Array.from({ length: this.settings.balls_count }, () => {
      const radius = random(this.settings.radius_min, this.settings.radius_max);
      const x = random(radius, canvasWidth - radius);
      const y = random(radius, canvasHeight - radius);
      const color = `hsl(${random(360, true)}, 50%, 50%)`;
      const vx = random(this.settings.speed_min, this.settings.speed_max, true);
      const vy = random(this.settings.speed_min, this.settings.speed_max, true);
      return new BouncingBall(x, y, radius, color, vx, vy);
    });
  }
  update(context: CanvasRenderingContext2D) {
    // Maybe for loop is better for performance?
    this.balls.forEach((ball) => ball.update(context));
  }
}
