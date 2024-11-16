const MAX_SIZE = 3;
const MAX_DENSITY = 30;
const DEFAULT_COLOR = 'rgba(255,255,255,1)';

export class Particle {
  public x: number;
  public y: number;
  public size: number;
  public density: number;

  private baseX: number;
  private baseY: number;

  constructor(x: number, y: number, size: number) {
    this.x = x;
    this.y = y;
    this.baseX = this.x;
    this.baseY = this.y;
    this.size = Math.random() * (size || MAX_SIZE) + 1;
    this.density = Math.random() * MAX_DENSITY + 1;
  }

  draw = (context: CanvasRenderingContext2D, color = DEFAULT_COLOR) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.closePath();
    context.fill();
  };

  update = (targetX: number, targetY: number, targetRadius: number) => {
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
  };
}
