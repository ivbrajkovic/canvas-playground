import { AnimationController } from '@/app/(2D)/particles/animation-controller';
import { CanvasController } from '@/app/(2D)/particles/canvas-controller';
import { FpsTracker } from '@/app/(2D)/particles/fps-tracker';
import { Mouse } from '@/app/(2D)/particles/mouse';
import { Particle } from '@/app/(2D)/particles/particle';

export class ParticleManager {
  private context: CanvasRenderingContext2D;
  private particles: Particle[] = [];

  public ghosting = 1;
  public isConnections = false;
  public linkingDistance = 120;
  public particleCount = 200;
  public particleColor = '#ffffff';
  public lineColor = '#ffffff';
  public lineWidth = 1;

  constructor(
    private canvasController: CanvasController,
    private animationController: AnimationController,
    private fpsTracker: FpsTracker,
    private mouse: Mouse,
  ) {
    this.mouse.maxRadius = 250;
    this.context = canvasController.context;
    this.canvasController.onResize = this.populate;

    this.animationController.onStart = () =>
      this.canvasController.addMouseMoveListener(this.onMouseMove);
    this.animationController.onStop = () =>
      this.canvasController.removeMouseMoveListener();

    this.animationController.animation = this.animate;
    this.animationController.isAnimating = true;

    this.populate();
  }

  private onMouseMove = (x: number, y: number) => {
    this.mouse.x = x;
    this.mouse.y = y;
    this.mouse.increaseRadius(10);
  };

  private render = () => {
    let dx: number,
      dy: number,
      distanceSquared: number,
      connectionDistanceSquared: number,
      opacityValue: number;

    for (let i = 0; i < this.particles.length; i++) {
      const particleA = this.particles[i];

      particleA.update(this.mouse.x, this.mouse.y, this.mouse.radius);
      particleA.move(this.context);
      particleA.draw(this.context, this.particleColor);

      if (!this.isConnections) continue;

      for (let j = i; j < this.particles.length; j++) {
        const particleB = this.particles[j];

        dx = particleA.x - particleB.x;
        dy = particleA.y - particleB.y;
        distanceSquared = dx * dx + dy * dy;
        connectionDistanceSquared = this.linkingDistance ** 2;

        if (distanceSquared > connectionDistanceSquared) continue;

        opacityValue =
          1 - Math.pow(distanceSquared / connectionDistanceSquared, 0.5);
        this.context.save();
        this.context.strokeStyle = this.lineColor;
        this.context.lineWidth = this.lineWidth;
        this.context.globalAlpha = opacityValue;
        this.context.beginPath();
        this.context.moveTo(particleA.x, particleA.y);
        this.context.lineTo(particleB.x, particleB.y);
        this.context.stroke();
        this.context.restore();
      }
    }
  };

  private animate = () => {
    this.context.fillStyle = `hsla(0, 0%, 10%, ${this.ghosting})`;
    this.context.fillRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height,
    );
    this.render();
    this.mouse.decreaseRadius(4);
    this.fpsTracker.track();
  };

  public populate = () => {
    this.particles = Array.from(
      { length: this.particleCount },
      () => new Particle(this.context.canvas.width, this.context.canvas.height),
    );
  };
}
