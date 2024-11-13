export class Portal {
  color = '#ff0000';
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public outCoordinates: { x: number; y: number },
  ) {}
  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}
