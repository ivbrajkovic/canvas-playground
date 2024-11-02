import random from 'lodash/random';

import { Circle } from '@/features/2D/classes/circle';

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 400;

type Settings = {
  speed_min: number;
  speed_max: number;
  radius_min: number;
  radius_max: number;
};

export abstract class CircleBase {
  random = random;
  canvasWidth = DEFAULT_WIDTH;
  canvasHeight = DEFAULT_HEIGHT;
  circles: Circle[] = [];

  abstract settings: Settings;
  abstract populate(...args: unknown[]): void;
  abstract render(...args: unknown[]): void;

  init(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.populate();
  }
}
