import { Particle } from '@/app/(2D)/particles/particle';
import { Mouse } from '@/app/(2D)/particles/mouse';
// import { FpsTracker } from '@/app/(2D)/particles/fps-tracker';
// import { AnimationController } from '@/app/(2D)/particles/animation-controller';

export class ParticleManager {
  // private _context: CanvasRenderingContext2D;
  // private _animationController: AnimationController;
  // private _mouse: Mouse;
  // private _fpsTracker: FpsTracker;
  private _particles: Particle[] = [];
  private _lineWidth = 1;

  public isConnections = false;
  public particleCount = 80;
  public particleColor = '#ffffff';
  public lineColor = '#ffffff';
  public linkingDistance = 120;
  public ghosting = 1;

  // prettier-ignore
  // get isAnimating() { return this._animationController.isAnimating; }
  // prettier-ignore
  // set isAnimating(value: boolean) { this._animationController.isAnimating = value; }

  // prettier-ignore
  // get mouseRadius() { return this._mouse.maxRadius; }
  // prettier-ignore
  // set mouseRadius(value: number) { this._mouse.maxRadius = value; }

  constructor(
    // context: CanvasRenderingContext2D,
    // mouse = new Mouse({ maxRadius: 250 }),
    // animationController = new AnimationController(),
    // fpsTracker = new FpsTracker(context.canvas.parentElement),
  ) {
    // this._context = context;
    // this._animationController = animationController;
    // this._mouse = mouse;
    // this._fpsTracker = fpsTracker;

    // animationController.animation = this._animation;
    // animationController.onStart = this._addMouseMoveListener;
    // animationController.onStop = this._removeMouseMoveListener;
  }

  // private _mouseMoveListener = (event: MouseEvent) => {
  //   this._mouse.x = event.offsetX;
  //   this._mouse.y = event.offsetY;
  //   this._mouse.increaseRadius(10);
  // };

  // private _addMouseMoveListener = () => {
  //   this._context.canvas.addEventListener('mousemove', this._mouseMoveListener);
  // };

  // private _removeMouseMoveListener = () => {
  //   this._context.canvas.removeEventListener(
  //     'mousemove',
  //     this._mouseMoveListener,
  //   );
  // };

  render = (
    context: CanvasRenderingContext2D,
    mouse: Mouse,
    width: number,
    height: number,
  ) => {
    const lineWidth = this._lineWidth;
    const connectionDistance = this.linkingDistance;
    const particleColor = this.particleColor;
    const lineColor = this.lineColor;

    let dx: number,
      dy: number,
      distanceSquared: number,
      connectionDistanceSquared: number,
      opacityValue: number;

    for (let i = 0; i < this._particles.length; i++) {
      const particleA = this._particles[i];

      particleA.update(mouse.x, mouse.y, mouse.radius);
      particleA.move(width, height);
      particleA.draw(context, particleColor);

      if (!this.isConnections) continue;

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

  clearCanvas = (
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => {
    context.fillStyle = `hsla(0, 0%, 10%, ${this.ghosting})`;
    context.fillRect(0, 0, width, height);
  };

  animation = (context: CanvasRenderingContext2D) => {
    const canvasWidth = context.canvas.width;
    const canvasHeight = context.canvas.height;

    context.fillStyle = `hsla(0, 0%, 10%, ${this.ghosting})`;
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    // this.render(context);
    // this._mouse.decreaseRadius(4);
    // this._fpsTracker.track();
  };

  populate = (width: number, height: number) => {
    this._particles = Array.from(
      { length: this.particleCount },
      () => new Particle(width, height),
    );
  };

  dispose = () => {
    // this._animationController.isAnimating = false;
    // this._fpsTracker.dispose();
    this._particles = [];
    // this._context = null!;
    // this._animationController = null!;
    // this._mouse = null!;
    // this._fpsTracker = null!;
  };
}
