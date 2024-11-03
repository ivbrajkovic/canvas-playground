import { Particle } from '@/app/(2D)/particles/particle';
import { Mouse } from '@/app/(2D)/particles/mouse';
import { FpsTracker } from '@/app/(2D)/particles/fps-tracker';
import { AnimationController } from '@/app/(2D)/particles/animation-controller';

export class ParticleManager {
  private _context: CanvasRenderingContext2D;
  private _animationController: AnimationController;
  private _mouse: Mouse;
  private _fpsTracker: FpsTracker;
  private _particles: Particle[] = [];
  private _particleCount = 200;
  private _lineWidth = 1;

  public particleColor = '#ffffff';
  public lineColor = '#ffffff';
  public linkingDistance = 120;
  public ghosting = 1;

  // prettier-ignore
  get particleCount() { return this._particleCount; }
  set particleCount(value: number) {
    this._particleCount = value;
    this.populate();
  }

  // prettier-ignore
  get isAnimating() { return this._animationController.isAnimating; }
  // prettier-ignore
  set isAnimating(value: boolean) { this._animationController.isAnimating = value; }

  constructor(
    context: CanvasRenderingContext2D,
    animationController = new AnimationController(),
    mouse = new Mouse(),
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
    this._mouse.increaseRadius(10);
  };

  private _addMouseMoveListener = () => {
    this._context.canvas.addEventListener('mousemove', this._mouseMoveListener);
  };

  private _removeMouseMoveListener = () => {
    this._context.canvas.removeEventListener('mousemove', this._mouseMoveListener);
  };

  private _render = () => {
    const context = this._context;
    const canvasWidth = context.canvas.width;
    const canvasHeight = context.canvas.height;
    const lineWidth = this._lineWidth;
    const connectionDistance = this.linkingDistance;
    const particleColor = this.particleColor;
    const lineColor = this.lineColor;

    const targetX = this._mouse.x;
    const targetY = this._mouse.y;
    const targetRadius = this._mouse.radius;

    let dx: number,
      dy: number,
      distanceSquared: number,
      connectionDistanceSquared: number,
      opacityValue: number;

    for (let i = 0; i < this._particles.length; i++) {
      const particleA = this._particles[i];

      particleA.respondToForces(targetX, targetY, targetRadius);
      particleA.move(canvasWidth, canvasHeight);
      particleA.draw(context, particleColor);

      for (let j = i; j < this._particles.length; j++) {
        const particleB = this._particles[j];

        dx = particleA.x - particleB.x;
        dy = particleA.y - particleB.y;
        distanceSquared = dx * dx + dy * dy;
        connectionDistanceSquared = connectionDistance ** 2;

        if (distanceSquared > connectionDistanceSquared) continue;

        opacityValue =
          1 - Math.pow(distanceSquared / connectionDistanceSquared, 0.5);
        context.save();
        context.strokeStyle = lineColor;
        context.lineWidth = lineWidth;
        context.globalAlpha = opacityValue;
        context.beginPath();
        context.moveTo(particleA.x, particleA.y);
        context.lineTo(particleB.x, particleB.y);
        context.stroke();
        context.restore();
      }
    }
  };

  private _animation = () => {
    const context = this._context;
    const canvasWidth = context.canvas.width;
    const canvasHeight = context.canvas.height;

    context.fillStyle = `hsla(0, 0%, 10%, ${this.ghosting})`;
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    this._render();
    this._mouse.reduceRadius();
    this._fpsTracker.track();
  };

  populate = () => {
    const width = this._context.canvas.width;
    const height = this._context.canvas.height;
    const length = this._particleCount;

    this._particles = Array.from({ length }, () => new Particle(width, height));
  };

  dispose = () => {
    this._animationController.isAnimating = false;
    this._fpsTracker.dispose();
    this._particles = [];
    this._context = null!;
    this._animationController = null!;
    this._mouse = null!;
    this._fpsTracker = null!;
  };
}
