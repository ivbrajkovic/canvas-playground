import {
  IMouseController,
  MouseController,
} from '@/controllers/mouse-controller';
import { assertClient } from '@/lib/assert-client';

export class CircleOutline {
  #x: number;
  #y: number;
  #vx: number;
  #vy: number;
  #radius: number;
  #color: string;
  #mass: number;
  #mouseRadius: number;
  #velocity: { x: number; y: number };
  #mouse: IMouseController;
  #opacity: number = 0;

  constructor(
    x: number,
    y: number,
    vx: number,
    vy: number,
    mass: number,
    color: string,
    radius: number,
    mouseRadius: number,
    mouse: IMouseController = new MouseController(),
  ) {
    this.#x = x;
    this.#y = y;
    this.#vx = vx;
    this.#vy = vy;
    this.#mass = mass;
    this.#color = color;
    this.#radius = radius;
    this.#mouseRadius = mouseRadius;
    this.#velocity = { x: vx, y: vy };
    this.#mouse = mouse;
  }

  init() {
    assertClient(window); // Asserts that the code is running in a client-side environment
    this.#mouse.init();
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.#x, this.#y, this.#radius, 0, Math.PI * 2, false);
    ctx.save();
    ctx.globalAlpha = this.#opacity;
    ctx.fillStyle = this.#color;
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = this.#color;
    ctx.stroke();
    ctx.closePath();
  }

  move(context: CanvasRenderingContext2D) {
    const canvas = context.canvas;

    // Bounce off canvas boundaries
    if (this.#x + this.#radius > canvas.width || this.#x - this.#radius < 0)
      this.#vx = -this.#vx;
    if (this.#y + this.#radius > canvas.height || this.#y - this.#radius < 0)
      this.#vy = -this.#vy;

    const distance = this.#mouse.getDistanceFromCoords(this.#x, this.#y);
    if (distance < this.#mouseRadius && this.#opacity <= 0.2)
      this.#opacity += 0.02;
    else if (this.#opacity > 0) this.#opacity -= 0.02;
    if (this.#opacity < 0) this.#opacity = 0;

    this.#x += this.#velocity.x;
    this.#y += this.#velocity.y;
  }

  update(context: CanvasRenderingContext2D, others: CircleOutline[]): void {
    for (let i = 0; i < others.length; i++) {
      if (this === others[i]) continue;

      const distance = getDistance(this.x, this.y, others[i].x, others[i].y);
      if (distance - this.radius - others[i].radius < 0) {
        resolveCollision(this, others[i]);
      }
    }

    this.draw(context);
    this.move(context);
  }
}
