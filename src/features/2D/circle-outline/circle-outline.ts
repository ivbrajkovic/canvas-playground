import { elasticCollision } from '@/lib/elastic-collision';
import { getDistanceBetweenCoords } from '@/lib/get-distance';

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
  #opacity: number = 0;

  // prettier-ignore
  get x() { return this.#x; }
  // prettier-ignore
  get y() { return this.#y; }
  // prettier-ignore
  get mass() { return this.#mass; }
  // prettier-ignore
  get velocity() { return this.#velocity; }

  #getDistanceBetweenCoords: (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    precise?: boolean,
  ) => number;

  constructor(
    x: number,
    y: number,
    vx: number,
    vy: number,
    mass: number,
    color: string,
    radius: number,
    mouseRadius: number,
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
    this.#getDistanceBetweenCoords = getDistanceBetweenCoords;
  }

  getDistanceFromCoords = (x: number, y: number, precise?: boolean) => {
    return this.#getDistanceBetweenCoords(this.#x, this.#y, x, y, precise);
  };

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

    // console.log({
    //   x: this.#x,
    //   y: this.#y,
    //   vx: this.#vx,
    //   vy: this.#vy,
    //   radius: this.#radius,
    //   mass: this.#mass,
    //   canvasWidth: canvas.width,
    //   canvasHeight: canvas.height,
    //   rightBoundaryX: this.#x + this.#radius,
    //   leftBoundaryX: this.#x - this.#radius,
    //   isOutOfRightBoundary: this.#x + this.#radius > canvas.width,
    //   isOutOfLeftBoundary: this.#x - this.#radius < 0,
    //   rightBoundaryY: this.#y + this.#radius,
    //   leftBoundaryY: this.#y - this.#radius,
    //   isOutOfBottomBoundary: this.#y + this.#radius > canvas.height,
    //   isOutOfTopBoundary: this.#y - this.#radius < 0,
    // });

    // Bounce off canvas boundaries
    if (this.#x + this.#radius > canvas.width || this.#x - this.#radius < 0)
      this.#vx = -this.#vx;
    if (this.#y + this.#radius > canvas.height || this.#y - this.#radius < 0)
      this.#vy = -this.#vy;

    this.#x += this.#vx;
    this.#y += this.#vy;
  }

  processMouseRadius(mouseX: number, mouseY: number): void {
    const distance = this.getDistanceFromCoords(mouseX, mouseY, true);
    if (distance < this.#mouseRadius && this.#opacity <= 0.2) {
      // const opacity = 1 - distance / this.#mouseRadius;
      const newOpacity = this.#opacity + 0.02;
      this.#opacity = newOpacity > 1 ? 1 : newOpacity;
    } else if (this.#opacity > 0) {
      const newOpacity = this.#opacity - 0.02;
      this.#opacity = newOpacity < 0 ? 0 : newOpacity;
    }
  }

  update(context: CanvasRenderingContext2D, circles: CircleOutline[]): void {
    for (let i = 0; i < circles.length; i++) {
      if (this === circles[i]) continue;

      const distance = this.getDistanceFromCoords(circles[i].#x, circles[i].#y);
      if (distance - this.#radius - circles[i].#radius < 0) {
        elasticCollision(this, circles[i]);
      }
    }

    this.draw(context);
    this.move(context);
  }
}
