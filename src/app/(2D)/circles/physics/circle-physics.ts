import random from 'lodash/random';

export class CirclePhysics {
  public x: number;
  public y: number;
  public oldX = 0;
  public oldY = 0;
  public hue = 309;
  public vx = random(10, 20);
  public vy = 0;
  public radius = 40;
  public ghosting = 1;

  private _friction = 0.999;
  public gravity = 0.35;
  public bounce = -0.8;

  get friction() {
    return 1 - this._friction;
  }

  set friction(value: number) {
    this._friction = 1 - value;
  }

  constructor(width: number, height: number) {
    this.x = random(0, width);
    this.y = random(this.radius, height / 3);
  }

  draw = (context: CanvasRenderingContext2D, width: number, height: number) => {
    context.fillStyle = `hsla(0, 0%, 10%, ${this.ghosting})`;
    context.fillRect(0, 0, width, height);

    const gradient = context.createRadialGradient(
      this.x - this.radius * 0.25,
      this.y - this.radius * 0.35,
      2,
      this.x,
      this.y,
      this.radius * 1.2,
    );
    gradient.addColorStop(0, `hsla(${this.hue},70%,50%,1)`);
    gradient.addColorStop(0.7, `hsla(${this.hue},40%,30%,1)`);
    gradient.addColorStop(1, `hsla(${this.hue},30%,10%,1)`);

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
  };

  update = (width: number, height: number) => {
    // Apply gravity & friction
    this.vx *= this._friction;
    if (Math.abs(this.vx) < 0.3) this.vx = 0;
    this.vy += this.gravity;
    this.y += this.vy;
    this.x += this.vx;

    // Bounce off canvas boundaries
    if (this.x + this.radius > width) {
      this.x = width - this.radius;
      this.vx *= this.bounce;
    } else if (this.x - this.radius < 0) {
      this.x = 0 + this.radius;
      this.vx *= this.bounce;
    }
    if (this.y + this.radius > height) {
      this.y = height - this.radius;
      this.vy *= this.bounce;
    } else if (this.y - this.radius < 0) {
      this.y = 0 + this.radius;
      this.vy *= this.bounce;
    }
  };
}
