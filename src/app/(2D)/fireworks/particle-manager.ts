import { Particle } from '@/app/(2D)/fireworks/particle';

export class ParticleManager {
  private _friction = 0.99;
  private particles: Particle[] = [];

  public alphaDecay = 0.005;
  public gravity = 0.01;
  public count = 400;
  public radius = 3;

  get friction() {
    return 1 - this._friction;
  }

  set friction(value) {
    this._friction = 1 - value;
  }

  createParticles = (mouseX: number, mouseY: number) => {
    for (let i = 0; i < this.count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      this.particles.push(
        new Particle(
          mouseX,
          mouseY,
          vx,
          vy,
          this.radius,
          this._friction,
          this.gravity,
          this.alphaDecay,
        ),
      );
    }
  };

  private _filterParticles = () => {
    this.particles = this.particles.filter((particle) => particle.alpha >= 0.1);
  };

  public animate = (context: CanvasRenderingContext2D) => {
    this._filterParticles();
    this.particles.forEach((particle) => {
      particle.update();
      particle.draw(context);
    });
  };
}
