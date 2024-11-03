import { CircleOutline } from '@/app/(2D)/circle-outline/circle-outline';
import { CirclesBase } from '@/features/2D/classes/CirclesBase';

type Settings = {
  speed_min: number;
  speed_max: number;
  radius_min: number;
  radius_max: number;
  mouse_radius: number;
  circle_count: number;
};

export class CircleOutlineManager extends CirclesBase {
  circles: CircleOutline[] = [];
  settings: Settings = {
    speed_min: -2.0,
    speed_max: 2.0,
    radius_min: 20,
    radius_max: 40,
    mouse_radius: 200,
    circle_count: 200,
  };
  populate = () => {
    this.circles = Array.from({ length: this.settings.circle_count }, () => {
      const radius = this.random(this.settings.radius_min, this.settings.radius_max);
      const x = this.random(radius, this.canvasWidth - radius);
      const y = this.random(radius, this.canvasHeight - radius);
      const vx = this.random(this.settings.speed_min, this.settings.speed_max, true);
      const vy = this.random(this.settings.speed_min, this.settings.speed_max, true);
      const vector = { x: vx, y: vy };
      const color = `hsl(${this.random(0, 360)}, 50%, 50%)`;
      const mouseRadius = this.settings.mouse_radius;
      return new CircleOutline(x, y, vector, color, radius, mouseRadius);
    });
  };
  render = (mouseX: number, mouseY: number, context: CanvasRenderingContext2D) => {
    this.circles.forEach((particle) => {
      particle.processMouseRadius(mouseX, mouseY);
      particle.move(context);
      particle.draw(context);
    });
  };
}
