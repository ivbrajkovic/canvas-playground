export class Particle {
  alpha: number;
  color: string;

  constructor(
    public x: number,
    public y: number,
    public vx: number,
    public vy: number,
    public radius: number,
    public friction: number,
    public gravity: number,
    public alphaDecay: number,
  ) {
    this.alpha = 1;
    this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.globalAlpha = this.alpha;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
    context.restore();
  }

  update(context: CanvasRenderingContext2D) {
    this.draw(context);
    this.x += this.vx;
    this.vx *= this.friction;

    this.y += this.vy * this.friction + Math.exp(this.gravity);
    this.vy *= this.friction;
    // this.y += this.vy + Math.exp(this.gravity);

    this.alpha -= this.alphaDecay;
  }
}
