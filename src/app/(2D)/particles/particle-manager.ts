import { AnimationController } from '@/app/(2D)/particles/animation-controller';
import { CanvasController } from '@/app/(2D)/particles/canvas-controller';
import { FpsTracker } from '@/app/(2D)/particles/fps-tracker';
import { Mouse } from '@/app/(2D)/particles/mouse';
import { Particle } from '@/app/(2D)/particles/particle';

export class ParticleManager {
  private _canvas: HTMLCanvasElement;
  private _canvasController: CanvasController;
  private _context: CanvasRenderingContext2D;
  private _animationController: AnimationController;
  private _fpsTracker: FpsTracker;
  private _particles: Particle[] = [];
  private _mouse: Mouse;

  // prettier-ignore
  get isAnimating() { return this._animationController.isAnimating; }
  // prettier-ignore
  set isAnimating(value: boolean) { this._animationController.isAnimating = value; }

  // prettier-ignore
  get mouseRadius() { return this._mouse.radius; }
  // prettier-ignore
  set mouseRadius(value: number) { this._mouse.radius = value; }

  public ghosting = 1;
  public isConnections = true;
  public linkingDistance = 120;
  public particleCount = 200;
  public particleColor = '#ffffff';
  public lineColor = '#ffffff';
  public lineWidth = 1;

  constructor(canvas: HTMLCanvasElement) {
    this._canvasController = new CanvasController(canvas);
    this._fpsTracker = new FpsTracker(canvas);
    this._animationController = new AnimationController();
    this._mouse = new Mouse();
    this._canvas = this._canvasController.canvas;
    this._context = this._canvasController.context;
    this._canvasController.onResize = this.populate;
    this._mouse.maxRadius = 250;

    this.populate();

    this._animationController.onStart = () =>
      this._canvasController.addMouseMoveListener(this._onMouseMove);
    this._animationController.onStop = () => this._canvasController.removeMouseMoveListener();
    this._animationController.animation = this._animation;
    this._animationController.isAnimating = true;
  }

  private _onMouseMove = (x: number, y: number) => {
    this._mouse.x = x;
    this._mouse.y = y;
    this._mouse.increaseRadius(10);
  };

  private _render = () => {
    let dx: number,
      dy: number,
      distanceSquared: number,
      connectionDistanceSquared: number,
      opacityValue: number;

    for (let i = 0; i < this._particles.length; i++) {
      const particleA = this._particles[i];

      particleA.update(this._mouse.x, this._mouse.y, this._mouse.radius);
      particleA.move(this._context);
      particleA.draw(this._context, this.particleColor);

      if (!this.isConnections) continue;

      for (let j = i; j < this._particles.length; j++) {
        const particleB = this._particles[j];

        dx = particleA.x - particleB.x;
        dy = particleA.y - particleB.y;
        distanceSquared = dx * dx + dy * dy;
        connectionDistanceSquared = this.linkingDistance ** 2;

        if (distanceSquared > connectionDistanceSquared) continue;

        opacityValue = 1 - Math.pow(distanceSquared / connectionDistanceSquared, 0.5);
        this._context.save();
        this._context.strokeStyle = this.lineColor;
        this._context.lineWidth = this.lineWidth;
        this._context.globalAlpha = opacityValue;
        this._context.beginPath();
        this._context.moveTo(particleA.x, particleA.y);
        this._context.lineTo(particleB.x, particleB.y);
        this._context.stroke();
        this._context.restore();
      }
    }
  };

  private _animation = () => {
    this._context.fillStyle = `hsla(0, 0%, 10%, ${this.ghosting})`;
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    this._render();
    this._mouse.decreaseRadius(4);
    this._fpsTracker.track();
  };

  public populate = () => {
    this._particles = Array.from(
      { length: this.particleCount },
      () => new Particle(this._canvas.width, this._canvas.height),
    );
  };

  public dispose = () => {
    this._animationController.dispose();
    this._canvasController.dispose();
    this._fpsTracker.dispose();
  };
}
