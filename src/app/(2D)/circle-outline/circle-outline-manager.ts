import random from 'lodash/random';
import { CircleOutline } from '@/app/(2D)/circle-outline/circle-outline';
import { CanvasController } from '@/controllers/canvas-controller';

type Settings = {
  speedMin?: number;
  speedMax?: number;
  radiusMin?: number;
  radiusMax?: number;
  circleCount?: number;
};

export class CircleOutlineManager {
  private _canvasController: CanvasController;

  public circles: CircleOutline[] = [];
  public circleCount = 200;
  public speedMin = -2.0;
  public speedMax = 2.0;
  public radiusMin = 20;
  public radiusMax = 40;

  public static of = (canvasController: CanvasController, settings: Settings) =>
    new CircleOutlineManager(canvasController, settings);

  private constructor(canvasController: CanvasController, settings: Settings) {
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
      const color = `hsl(${random(0, 360)}, 50%, 50%)`;
      return new CircleOutline(x, y, vector, color, radius);
    });
  };
}
