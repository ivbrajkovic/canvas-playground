import random from 'lodash/random';
import { Circle } from '@/classes/circle';
import { CanvasController } from '@/controllers/canvas-controller';

type Settings = {
  speedMin?: number;
  speedMax?: number;
  radiusMin?: number;
  radiusMax?: number;
  circleCount?: number;
};

export class CircleTrailManager {
  private _canvasController: CanvasController;

  public circles: Circle[] = [];
  public circleCount = 80;
  public speedMin = -2.0;
  public speedMax = 2.0;
  public radiusMin = 15;
  public radiusMax = 35;

  static of = (canvasController: CanvasController, settings: Settings) =>
    new CircleTrailManager(canvasController, settings);

  constructor(canvasController: CanvasController, settings: Settings) {
    this._canvasController = canvasController;
    Object.assign(this, settings);
    this.populate();
  }

  public populate = () => {
    const { width, height } = this._canvasController;

    this.circles = Array.from({ length: this.circleCount }, () => {
      const radius = random(this.radiusMin, this.radiusMax);
      const x = random(radius, width - radius);
      const y = random(radius, height - radius);
      const vx = random(this.speedMin, this.speedMax, true);
      const vy = random(this.speedMin, this.speedMax, true);
      const vector = { x: vx, y: vy };
      const color = `hsl(${random(360, true)}, 50%, 50%)`;
      return new Circle(x, y, vector, radius, 1, color, color);
    });
  };
}
