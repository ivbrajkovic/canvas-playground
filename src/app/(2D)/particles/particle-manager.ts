import { Particle } from '@/app/(2D)/particles/particle';
import { ParticleOptions } from '@/app/(2D)/particles/types';
import { Mouse } from '@/app/(2D)/particles/mouse';

const DEFAULT_CANVAS_WIDTH = 800;
const DEFAULT_CANVAS_HEIGHT = 600;

type Settings = {
  speed_min: number;
  speed_max: number;
  radius_min: number;
  radius_max: number;
};

export class ParticleManager {
  particles: Particle[] = [];
  options: ParticleOptions = {
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

  constructor() {}

  populate = (width: number, height: number) => {
    const particleCount =
      this.options.particleCount ??
      Math.ceil(((width + height) / 100) * this.options.particleCountFactor);
    this.particles = Array.from(
      { length: particleCount },
      () => new Particle(width, height),
    );
  };

  draw = (
    context: CanvasRenderingContext2D,
    targetX: number,
    targetY: number,
    targetRadius: number,
  ) => {
    const canvasWidth = context.canvas.width;
    const canvasHeight = context.canvas.height;
    const colorOpacity = this.options.color.opacity;
    const r = this.options.color.particle.r;
    const g = this.options.color.particle.g;
    const b = this.options.color.particle.b;
    const lineWidth = this.options.lineWidth;
    const connectionDistance = this.options.connectionDistance;
    const particleColor = `rgba(${r},${g},${b},${colorOpacity})`;

    let dx: number,
      dy: number,
      distanceSquared: number,
      connectionDistanceSquared: number,
      opacityValue: number;

    for (let i = 0; i < this.particles.length; i++) {
      const particleA = this.particles[i];

      particleA.update(targetX, targetY, targetRadius);
      particleA.move(canvasWidth, canvasHeight);
      particleA.draw(context, particleColor);

      for (let j = i; j < this.particles.length; j++) {
        const particleB = this.particles[j];

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
}
