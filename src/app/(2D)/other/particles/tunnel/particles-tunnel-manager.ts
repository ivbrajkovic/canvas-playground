import { Particle } from '@/app/(2D)/other/particles/tunnel/particle';
import { BoundedValue } from '@/classes/bounded-value';

export class ParticleTunnelManager {
  public isAnimateColor = true;

  public count = 50;
  public speed = 5;
  public radius = 5;
  public interval = BoundedValue.of(300, 16, 300);

  private hue = 0;
  private hueRadians = 0;
  private radian = (Math.PI * 2) / this.count;
  private particles: Particle[] = [];

  static of = () => new ParticleTunnelManager();
  constructor() {}

  changeHue = () => {
    if (!this.isAnimateColor) return;
    this.hueRadians += 0.01;
    this.hue = Math.sin(this.hueRadians) * 360;
  };

  filterParticles = () => {
    this.particles = this.particles.filter((particle) => !particle.collect);
  };

  generateRing = (mouseX: number, mouseY: number) => {
    this.filterParticles();

    for (let i = 0; i < this.count; i++) {
      const vx = Math.cos(this.radian * i);
      const vy = Math.sin(this.radian * i);
      this.particles.push(
        new Particle(
          mouseX,
          mouseY,
          vx,
          vy,
          `hsl(${this.hue}, 100%, 50%)`,
          this.speed,
          this.radius,
        ),
      );
    }
  };

  drawParticles = (context: CanvasRenderingContext2D) => {
    this.particles.forEach((particle) => {
      particle.draw(context);
      particle.update(context);
    });
  };
}
