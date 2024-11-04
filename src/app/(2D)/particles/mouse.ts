type MouseProps = {
  x?: number;
  y?: number;
  radius?: number;
  minRadius?: number;
  maxRadius?: number;
};

export class Mouse {
  public x;
  public y;
  public radius;
  public minRadius;
  public maxRadius;

  constructor({
    x = -1000,
    y = -1000,
    radius = 120,
    minRadius = 0,
    maxRadius = 180,
  }: MouseProps = {}) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.minRadius = minRadius;
    this.maxRadius = maxRadius;
  }

  updateCoords(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  increaseRadius(value = 1) {
    const newRadius = this.radius + value;
    this.radius = newRadius > this.maxRadius ? this.maxRadius : newRadius;
  }

  decreaseRadius(value = 1) {
    const newRadius = this.radius - value;
    this.radius = newRadius < this.minRadius ? this.minRadius : newRadius;
  }
}
