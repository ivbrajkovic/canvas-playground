export type CircleConstructorArgs = ConstructorParameters<typeof Circle>;

export type Vec2 = {
  x: number;
  y: number;
};

export class Circle {
  constructor(
    public x: number,
    public y: number,
    public vector: Vec2,
    public radius: number,
    public opacity: number,
    public fillColor: string,
    public strokeColor: string,
  ) {}

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.save();
    context.globalAlpha = this.opacity;
    context.fillStyle = this.fillColor;
    context.fill();
    context.restore();
    context.strokeStyle = this.strokeColor;
    context.stroke();
    context.closePath();
  }

  move(width: number, height: number) {
    // Bounce off canvas boundaries
    if (this.x + this.radius > width || this.x - this.radius < 0)
      this.vector.x = -this.vector.x;
    if (this.y + this.radius > height || this.y - this.radius < 0)
      this.vector.y = -this.vector.y;
    // Move ball by velocity
    this.x += this.vector.x;
    this.y += this.vector.y;
  }
}
