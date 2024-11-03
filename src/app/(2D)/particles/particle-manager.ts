import { Particle } from '@/app/(2D)/particles/particle';
import { ParticleOptions } from '@/app/(2D)/particles/types';
import { Mouse } from '@/app/(2D)/particles/mouse';
import { AnimationController } from '@/controllers/animation-controller';
import { FpsTracker } from '@/app/(2D)/particles/fps-tracker';

export class ParticleManager {
  private _context: CanvasRenderingContext2D;
  private _animationController: AnimationController;
  private _mouse: Mouse;
  private _fpsTracker: FpsTracker;
  private _particles: Particle[] = [];

  public options: ParticleOptions = {
    color: {
      opacity: 1,
      particle: { r: 255, g: 255, b: 255 },
      connection: { r: 255, g: 255, b: 255 },
    },
    connectionDistance: 120,
    lineWidth: 1,
    particleCountFactor: 12,
    particleCount: 200,
  };

  // prettier-ignore
  get particleCount() { return this._particles.length; }

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
    this._context.canvas.removeEventListener(
      'mousemove',
      this._mouseMoveListener,
    );
  };

  private _render = () => {
    // TODO: Refactor
    const context = this._context;
    const canvasWidth = context.canvas.width;
    const canvasHeight = context.canvas.height;
    const colorOpacity = this.options.color.opacity;
    const r = this.options.color.particle.r;
    const g = this.options.color.particle.g;
    const b = this.options.color.particle.b;
    const lineWidth = this.options.lineWidth;
    const connectionDistance = this.options.connectionDistance;
    const particleColor = `rgba(${r},${g},${b},${colorOpacity})`;

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
          (1 - Math.pow(distanceSquared / connectionDistanceSquared, 0.5)) *
          colorOpacity;
        context.strokeStyle = `rgba(${r},${g},${b},${opacityValue})`;
        context.lineWidth = lineWidth;
        context.beginPath();
        context.moveTo(particleA.x, particleA.y);
        context.lineTo(particleB.x, particleB.y);
        context.stroke();
      }
    }
  };

  private _animation = () => {
    const context = this._context;
    const canvasWidth = context.canvas.width;
    const canvasHeight = context.canvas.height;

    context.clearRect(0, 0, canvasWidth, canvasHeight);
    this._render();
    this._mouse.reduceRadius();
    this._fpsTracker.track();
  };

  // TODO: Refactor
  populate = () => {
    const width = this._context.canvas.width;
    const height = this._context.canvas.height;
    const particleCount =
      this.options.particleCount ??
      Math.ceil(((width + height) / 100) * this.options.particleCountFactor);
    this._particles = Array.from(
      { length: particleCount },
      () => new Particle(width, height),
    );
  };

  startAnimation = () => {
    this._animationController.start(this._animation);
    this._addMouseMoveListener();
  };

  stopAnimation = () => {
    this._animationController.stop();
    this._removeMouseMoveListener();
  };

  dispose = () => {
    this.stopAnimation();
    this._fpsTracker.dispose();
    this._particles = [];
    this._context = null!;
    this._animationController = null!;
    this._mouse = null!;
    this._fpsTracker = null!;
  };
}
