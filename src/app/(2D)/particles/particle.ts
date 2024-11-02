import { getDistanceBetweenCoords } from '@/lib/get-distance';

export class Particle {
  private baseX: number;
  private baseY: number;

  constructor(
    public x: number,
    public y: number,
    public vector: { x: number; y: number },
    public color: string,
    public radius: number,
    public density: number,
    public line: {
      distance: number;
      width: number;
      color: string;
      opacity: number;
    },
  ) {
    this.baseX = x;
    this.baseY = y;
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.closePath();
    context.fill();
  }

  move(context: CanvasRenderingContext2D) {
    const canvasWidth = context.canvas.width;
    const canvasHeight = context.canvas.height;

    if (this.x + this.vector.x < 0) {
      this.vector.x *= -1;
      this.x = 0;
      this.baseX = 0;
    } else if (this.x + this.vector.x > canvasWidth) {
      this.vector.x *= -1;
      this.x = canvasWidth;
      this.baseX = canvasWidth;
    }

    if (this.y + this.vector.y < 0) {
      this.vector.y *= -1;
      this.y = 0;
      this.baseY = 0;
    } else if (this.y + this.vector.y > canvasHeight) {
      this.vector.y *= -1;
      this.y = canvasHeight;
      this.baseY = canvasHeight;
    } else {
      this.x += this.vector.x;
      this.baseX += this.vector.x;
      this.y += this.vector.y;
      this.baseY += this.vector.y;
    }
  }

  processRadius(targetX: number, targetY: number, targetRadius: number): void {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const distance = getDistanceBetweenCoords(targetX, targetY, this.x, this.y, true);

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

  drawLine(context: CanvasRenderingContext2D, particles: Particle[]) {
    const { distance, width, color, opacity } = this.line;

    let dx: number,
      dy: number,
      distanceSquared: number,
      connectionDistanceSquared: number;
    // opacityValue: number;

    for (let i = 0; i < particles.length; i++) {
      const particleA = particles[i];

      for (let j = i; j < particles.length; j++) {
        const particleB = particles[j];
        dx = particleA.x - particleB.x;
        dy = particleA.y - particleB.y;
        distanceSquared = dx * dx + dy * dy;
        connectionDistanceSquared = distance ** 2;

        if (distanceSquared < connectionDistanceSquared) {
          // opacityValue =
          //   (1 - Math.pow(distanceSquared / connectionDistanceSquared, 0.5)) *
          //   opacity;
          // context.strokeStyle = `rgba(${color.connection.r},${color.connection.g},${color.connection.b},${opacityValue})`;
          context.strokeStyle = color;
          context.lineWidth = width;
          context.beginPath();
          context.moveTo(particleA.x, particleA.y);
          context.lineTo(particleB.x, particleB.y);
          context.stroke();
        }
      }

      // particleA.draw(context);
    }
  }
}
