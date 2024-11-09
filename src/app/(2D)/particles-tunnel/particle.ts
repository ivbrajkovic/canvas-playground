export class Particle {
  endAngle: number = Math.PI * 2;
  collect: boolean = false;

  constructor(
    public x: number,
    public y: number,
    public vx: number,
    public vy: number,
    public color: string,
    public speed: number,
    public radius: number,
  ) {}

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, this.endAngle, false);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
  }

  update(context: CanvasRenderingContext2D) {
    this.x += this.vx * this.speed;
    this.y += this.vy * this.speed;

    if (
      this.x + this.radius < 0 ||
      this.x - this.radius > context.canvas.width ||
      this.y + this.radius < 0 ||
      this.y - this.radius > context.canvas.height
    ) {
      this.collect = true;
    }
  }
}
