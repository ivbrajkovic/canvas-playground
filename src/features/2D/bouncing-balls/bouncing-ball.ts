import { Circle } from '@/features/2D/classes/circle';

export class BouncingBall extends Circle {
  constructor(...args: ConstructorParameters<typeof Circle>) {
    super(...args);
  }

  update(context: CanvasRenderingContext2D) {
    const canvas = context.canvas;

    // Bounce off canvas boundaries
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0)
      this.vx = -this.vx;
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0)
      this.vy = -this.vy;

    // Move ball by velocity
    this.x += this.vx;
    this.y += this.vy;

    // Draw ball on canvas
    this.draw(context);
  }
}
