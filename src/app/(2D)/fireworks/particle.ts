class Particle {
  alpha: number;
  color: string;
  
  constructor(
    public x: number,
    public y: number,
    public vx: number,
    public vy: number,
  ) {
    this.alpha = 1;
    this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
  }
  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.globalAlpha = this.alpha;
    context.beginPath();
    context.arc(this.x, this.y, settings.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
    context.restore();
  }
  update(context: CanvasRenderingContext2D) {
    this.draw(context);
    this.x += this.vx;
    this.vx *= settings.fiction;

    // this.y += this.vy * settings.fiction + Math.exp(settings.gravity);
    this.vy *= settings.fiction;
    this.y += this.vy + Math.exp(settings.gravity);

    this.alpha -= settings.alphaDecay;
  }
}
