import random from 'lodash/random';
import { AnimationController } from '@/app/(2D)/particles/animation-controller';
import { Circle } from '@/features/2D/classes/circle';
import { FpsTracker } from '@/app/(2D)/particles/fps-tracker';
import { CanvasController } from '@/app/(2D)/particles/canvas-controller';

export class CircleTrailManager {
  private _canvas: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D;
  private _canvasController: CanvasController;
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

  constructor(canvas: HTMLCanvasElement) {
    this._canvasController = new CanvasController(canvas);
    this._fpsTracker = new FpsTracker(canvas);
    this._animationController = new AnimationController();
    this._canvas = this._canvasController.canvas;
    this._context = this._canvasController.context;

    this.populate();

    this._animationController.animation = this._animation;
    this._animationController.isAnimating = true;
  }

  private _render = () => {
    this._circles.forEach((circle) => {
      circle.move(this._context);
      circle.draw(this._context);
    });
  };

  private _animation = () => {
    this._context.fillStyle = `hsla(0, 0%, 10%, ${this._trailing})`;
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

    this._render();
    this._fpsTracker.track();
  };

  public populate = () => {
    this._circles = Array.from({ length: this.circleCount }, () => {
      const radius = random(this.radiusMin, this.radiusMax);
      const x = random(radius, this._canvas.width - radius);
      const y = random(radius, this._canvas.height - radius);
      const vx = random(this.speedMin, this.speedMax, true);
      const vy = random(this.speedMin, this.speedMax, true);
      const vector = { x: vx, y: vy };
      const color = `hsl(${random(360, true)}, 50%, 50%)`;
      return new Circle(x, y, vector, radius, 1, color, color);
    });
  };

  public dispose = () => {
    this._fpsTracker.dispose();
    this._animationController.stop();
    this._canvasController.dispose();
    this._circles = [];
    this._context = null!;
    this._canvas = null!;
    this._fpsTracker = null!;
    this._canvasController = null!;
    this._animationController = null!;
  };
}
