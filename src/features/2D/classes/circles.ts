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
  defaultCanvasWidth = DEFAULT_WIDTH;
  defaultCanvasHeight = DEFAULT_HEIGHT;
  circles: Circle[] = [];
  abstract settings: Settings;
  abstract init(canvasWidth?: number, canvasHeight?: number): void;
  abstract update(...args: unknown[]): void;
}
