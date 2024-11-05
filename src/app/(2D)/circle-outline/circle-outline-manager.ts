import random from 'lodash/random';
import { CircleOutline } from '@/app/(2D)/circle-outline/circle-outline';
import { AnimationController } from '@/features/animation-controller/animation-controller';
import { FpsTracker } from '@/features/fps-tracker/fps-tracker';
import { Mouse } from '@/app/(2D)/particles/mouse';
import { CanvasController } from '@/app/(2D)/particles/canvas-controller';

export class CircleOutlineManager {
  private _canvas: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D;
  private _canvasController: CanvasController;
  private _animationController: AnimationController;
  private _fpsTracker: FpsTracker;
  private _mouse: Mouse;
  private _circles: CircleOutline[] = [];

  public circleCount = 200;
  public speedMin = -2.0;
  public speedMax = 2.0;
  public radiusMin = 20;
  public radiusMax = 40;

  // prettier-ignore
  get isAnimating() { return this._animationController.isAnimating; }
  // prettier-ignore
  set isAnimating(value: boolean) { this._animationController.isAnimating = value; }

  // prettier-ignore
  get mouseRadius() { return this._mouse.radius; }
  // prettier-ignore
  set mouseRadius(value: number) { this._mouse.radius = value; }

  constructor(canvas: HTMLCanvasElement) {
    this._canvasController = new CanvasController(canvas);
    this._fpsTracker = new FpsTracker(canvas);
    this._animationController = new AnimationController();
    this._mouse = new Mouse();
    this._canvas = this._canvasController.canvas;
    this._context = this._canvasController.context;

    this._mouse.radius = 200;

    this.populate();

    this._animationController.onStart = () =>
      this._canvasController.addMouseMoveListener(this._onMouseMove);
    this._animationController.onStop = () =>
      this._canvasController.removeMouseMoveListener();
    this._animationController.animation = this._animation;
    this._animationController.isAnimating = true;
  }

  private _onMouseMove = (x: number, y: number) => {
    this._mouse.x = x;
    this._mouse.y = y;
  };

  private _render = () => {
    this._circles.forEach((particle) => {
      particle.respondToForces(this._mouse.x, this._mouse.y, this._mouse.radius);
      particle.move(this._context);
      particle.draw(this._context);
    });
  };

  private _animation = () => {
    this._context.fillStyle = `hsla(0, 0%, 10%, 1)`;
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

    this._render();
    this._fpsTracker.track();
  };

  populate = () => {
    this._circles = Array.from({ length: this.circleCount }, () => {
      const radius = random(this.radiusMin, this.radiusMax);
      const x = random(radius, this._canvas.width - radius);
      const y = random(radius, this._canvas.height - radius);
      const vx = random(this.speedMin, this.speedMax, true);
      const vy = random(this.speedMin, this.speedMax, true);
      const vector = { x: vx, y: vy };
      const color = `hsl(${random(0, 360)}, 50%, 50%)`;
      return new CircleOutline(x, y, vector, color, radius);
    });
  };

  dispose = () => {
    this._fpsTracker.dispose();
    this._animationController.dispose();
    this._canvasController.dispose();
  };
}
