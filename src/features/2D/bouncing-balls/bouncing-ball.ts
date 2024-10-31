import { Circle } from '@/features/2D/classes/circle';

export class BouncingBall extends Circle {
  constructor(...args: ConstructorParameters<typeof Circle>) {
    super(...args);
  }

  update(context: CanvasRenderingContext2D) {
    if (
      this.x + this.radius > context.canvas.width ||
      this.x - this.radius < 0
    ) {
      this.vx = -this.vx;
    }

    if (
      this.y + this.radius > context.canvas.height ||
      this.y - this.radius < 0
    ) {
      this.vy = -this.vy;
    }

    this.x += this.vx;
    this.y += this.vy;

    this.draw(context);
  }
}
