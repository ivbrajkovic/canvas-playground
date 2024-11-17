export class Pellet {
  isRender = true;
  color = 'white';
  constructor(
    public x: number,
    public y: number,
    public radius: number,
  ) {}
  draw(context: CanvasRenderingContext2D) {
    if (!this.isRender) return;
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
  }
}
