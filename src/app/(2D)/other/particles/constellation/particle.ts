const SPEED = 0.8;
const MAX_SIZE = 3;
const MAX_DENSITY = 30;
const DEFAULT_COLOR = 'rgba(255,255,255)';

export class Particle {
  public x: number;
  public y: number;

  private baseX: number;
  private baseY: number;
  private size: number;
  private density: number;
  private directionAngle: number;
  private vector: { x: number; y: number };

  constructor(width: number, height: number, size = MAX_SIZE) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.baseX = this.x;
    this.baseY = this.y;
    this.size = Math.random() * (size || MAX_SIZE) + 1;
    this.density = Math.random() * MAX_DENSITY + 1;
    this.directionAngle = Math.floor(Math.random() * 360 + 1);
    this.vector = {
      x: Math.cos(this.directionAngle) * SPEED,
      y: Math.sin(this.directionAngle) * SPEED,
    };
  }

  draw(context: CanvasRenderingContext2D, color: string) {
    context.fillStyle = color || DEFAULT_COLOR;
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.closePath();
    context.fill();
  }

  move(width: number, height: number) {
    if (this.x + this.vector.x < 0) {
      this.vector.x *= -1;
      this.x = 0;
      this.baseX = 0;
    } else if (this.x + this.vector.x > width) {
      this.vector.x *= -1;
      this.x = width;
      this.baseX = width;
    }

    if (this.y + this.vector.y < 0) {
      this.vector.y *= -1;
      this.y = 0;
      this.baseY = 0;
    } else if (this.y + this.vector.y > height) {
      this.vector.y *= -1;
      this.y = height;
      this.baseY = height;
    } else {
      this.x += this.vector.x;
      this.baseX += this.vector.x;
      this.y += this.vector.y;
      this.baseY += this.vector.y;
    }
  }

  update(targetX: number, targetY: number, targetRadius: number): void {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < targetRadius) {
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;
      const force = (targetRadius - distance) / targetRadius;
      const directionX = forceDirectionX * force * this.density;
      const directionY = forceDirectionY * force * this.density;
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        const dx = this.x - this.baseX;
        this.x -= dx / 50;
      }
      if (this.y !== this.baseY) {
        const dy = this.y - this.baseY;
        this.y -= dy / 50;
      }
    }
  }
}
