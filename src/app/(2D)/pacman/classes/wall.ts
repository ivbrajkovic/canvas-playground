export class Wall {
  color = '#3a7bd5';
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
  ) {}
  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}
