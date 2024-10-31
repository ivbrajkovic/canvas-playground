import random from 'lodash/random';

import { BouncingBall } from '@/features/2D/bouncing-balls/bouncing-ball';

type Settings = {
  vMin: number;
  vMax: number;
  radiusMin: number;
  radiusMax: number;
  numberOfBalls: number;
};

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 400;

export class BouncingBalls {
  balls: BouncingBall[] = [];
  settings: Settings = {
    vMin: -3.0,
    vMax: 3.0,
    radiusMin: 15,
    radiusMax: 35,
    numberOfBalls: 20,
  };
  createBalls(canvasWidth = DEFAULT_WIDTH, canvasHeight = DEFAULT_HEIGHT) {
    this.balls = Array.from({ length: this.settings.numberOfBalls }, () => {
      const radius = random(this.settings.radiusMin, this.settings.radiusMax);
      const x = random(radius, canvasWidth - radius);
      const y = random(radius, canvasHeight - radius);
      const color = `hsl(${random(360, true)}, 50%, 50%)`;
      const vx = random(this.settings.vMin, this.settings.vMax, true);
      const vy = random(this.settings.vMin, this.settings.vMax, true);
      return new BouncingBall(x, y, radius, color, vx, vy);
    });
  }
}
