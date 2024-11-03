import random from 'lodash/random';
import { AnimationController } from '@/app/(2D)/particles/animation-controller';
import { Circle } from '@/features/2D/classes/circle';
import { FpsTracker } from '@/app/(2D)/particles/fps-tracker';

export class CircleTrailManager {
  private _context: CanvasRenderingContext2D;
  private _animationController: AnimationController;
  private _fpsTracker: FpsTracker;
  private _circles: Circle[] = [];
  private _trailing = 0.2;

  public circleCount = 80;
  public speedMin = -2.0;
  public speedMax = 2.0;
  public radiusMin = 15;
  public radiusMax = 35;

  // prettier-ignore
  get isAnimating() { return this._animationController.isAnimating; }
  // prettier-ignore
  set isAnimating(value: boolean) { this._animationController.isAnimating = value; }

  // prettier-ignore
  get trailing() { return 1 - this._trailing; }
  // prettier-ignore
  set trailing(value: number) { this._trailing = 1 - value; }

  constructor(
    context: CanvasRenderingContext2D,
    animationController: AnimationController = new AnimationController(),
    fpsTracker = new FpsTracker(context.canvas.parentElement),
  ) {
    this._context = context;
    this._animationController = animationController;
    this._fpsTracker = fpsTracker;

    animationController.animation = this._animation;
  }

  populate = () => {
    const width = this._context.canvas.width;
    const height = this._context.canvas.height;
    const length = this.circleCount;

    this._circles = Array.from({ length }, () => {
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

  private _render = () => {
    const context = this._context;
    this._circles.forEach((circle) => {
      circle.move(context);
      circle.draw(context);
    });
  };

  private _animation = () => {
    const context = this._context;
    const canvasWidth = context.canvas.width;
    const canvasHeight = context.canvas.height;

    context.fillStyle = `hsla(0, 0%, 10%, ${this._trailing})`;
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    this._render();
    this._fpsTracker.track();
  };

  dispose = () => {
    this._fpsTracker.dispose();
    this._animationController.stop();
    this._circles = [];
    this._context = null!;
    this._fpsTracker = null!;
    this._animationController = null!;
  };
}
