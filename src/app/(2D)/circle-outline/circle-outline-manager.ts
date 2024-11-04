import random from 'lodash/random';
import { CircleOutline } from '@/app/(2D)/circle-outline/circle-outline';
import { AnimationController } from '@/app/(2D)/particles/animation-controller';
import { FpsTracker } from '@/app/(2D)/particles/fps-tracker';
import { Mouse } from '@/app/(2D)/particles/mouse';

export class CircleOutlineManager {
  private _context: CanvasRenderingContext2D;
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

  constructor(
    context: CanvasRenderingContext2D,
    animationController = new AnimationController(),
    mouse = new Mouse({ radius: 200, maxRadius: 500 }),
    fpsTracker = new FpsTracker(context.canvas.parentElement),
  ) {
    this._context = context;
    this._animationController = animationController;
    this._mouse = mouse;
    this._fpsTracker = fpsTracker;

    animationController.animation = this._animation;
    animationController.onStart = this._addMouseMoveListener;
    animationController.onStop = this._removeMouseMoveListener;
  }

  private _mouseMoveListener = (event: MouseEvent) => {
    this._mouse.x = event.offsetX;
    this._mouse.y = event.offsetY;
  };

  private _addMouseMoveListener = () => {
    this._context.canvas.addEventListener('mousemove', this._mouseMoveListener);
  };

  private _removeMouseMoveListener = () => {
    this._context.canvas.removeEventListener(
      'mousemove',
      this._mouseMoveListener,
    );
  };

  private _render = () => {
    const context = this._context;
    const mouseX = this._mouse.x;
    const mouseY = this._mouse.y;
    const mouseRadius = this._mouse.radius;

    this._circles.forEach((particle) => {
      particle.respondToForces(mouseX, mouseY, mouseRadius);
      particle.move(context);
      particle.draw(context);
    });
  };

  private _animation = () => {
    const context = this._context;
    const canvasWidth = context.canvas.width;
    const canvasHeight = context.canvas.height;

    context.fillStyle = `hsla(0, 0%, 10%, 1)`;
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    this._render();
    this._fpsTracker.track();
  };

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
      const color = `hsl(${random(0, 360)}, 50%, 50%)`;
      return new CircleOutline(x, y, vector, color, radius);
    });
  };

  dispose = () => {
    this._animationController.isAnimating = false;
    this._fpsTracker.dispose();
    this._circles = [];
    this._context = null!;
    this._animationController = null!;
    this._mouse = null!;
    this._fpsTracker = null!;
  };
}
