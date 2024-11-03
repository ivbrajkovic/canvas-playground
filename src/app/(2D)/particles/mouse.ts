export class Mouse {
  constructor(
    public x = 0,
    public y = 0,
    public radius = 120,
    public minRadius = 0,
    public maxRadius = 180,
  ) {}

  update(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  increaseRadius(value = 1) {
    const newRadius = this.radius + value;
    this.radius = newRadius > this.maxRadius ? this.maxRadius : newRadius;
  }

  reduceRadius(value = 1) {
    const newRadius = this.radius - value;
    this.radius = newRadius < this.minRadius ? this.minRadius : newRadius;
  }
}
