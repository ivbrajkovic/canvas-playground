import { Particle } from '@/app/(2D)/other/particles/constellation/particle';
import { CanvasController } from '@/controllers/canvas-controller';

type Settings = {
  particleCount?: number;
  linkingDistance?: number;
  particleColor?: string;
  lineColor?: string;
  lineWidth?: number;
};

export class ParticleManager {
  private _canvasController: CanvasController;

  public particles: Particle[] = [];
  public isConnections = true;
  public linkingDistance = 120;
  public particleCount = 200;
  public particleColor = '#ffffff';
  public lineColor = '#ffffff';
  public lineWidth = 1;

  public static of = (canvasController: CanvasController, settings: Settings) =>
    new ParticleManager(canvasController, settings);

  constructor(canvasController: CanvasController, settings: Settings) {
    this._canvasController = canvasController;
    Object.assign(this, settings);
    this.populate();
  }

  public populate = () => {
    const { width, height } = this._canvasController;
    this.particles = Array.from(
      { length: this.particleCount },
      () => new Particle(width, height),
    );
  };

  drawParticle = (context: CanvasRenderingContext2D, particle: Particle) => {
    particle.draw(context, this.particleColor);
  };

  drawLine = (
    context: CanvasRenderingContext2D,
    particle: Particle,
    index: number,
  ) => {
    let dx: number,
      dy: number,
      distanceSquared: number,
      connectionDistanceSquared: number,
      opacityValue: number;

    if (!this.isConnections) return;

    for (let j = index; j < this.particles.length; j++) {
      const otherParticle = this.particles[j];

      dx = particle.x - otherParticle.x;
      dy = particle.y - otherParticle.y;
      distanceSquared = dx * dx + dy * dy;
      connectionDistanceSquared = this.linkingDistance ** 2;

      if (distanceSquared > connectionDistanceSquared) continue;

      opacityValue = 1 - Math.pow(distanceSquared / connectionDistanceSquared, 0.5);
      context.save();
      context.strokeStyle = this.lineColor;
      context.lineWidth = this.lineWidth;
      context.globalAlpha = opacityValue;
      context.beginPath();
      context.moveTo(particle.x, particle.y);
      context.lineTo(otherParticle.x, otherParticle.y);
      context.stroke();
      context.restore();
    }
  };
}
