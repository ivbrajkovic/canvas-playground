import { Circle } from '@/features/2D/classes/circle';
import { CirclesBase } from '@/features/2D/classes/CirclesBase';

type Settings = {
  speed_min: number;
  speed_max: number;
  radius_min: number;
  radius_max: number;
  circle_count: number;
};

export class CircleManager extends CirclesBase {
  circles: Circle[] = [];
  settings: Settings = {
    speed_min: -2.0,
    speed_max: 2.0,
    radius_min: 15,
    radius_max: 35,
    circle_count: 80,
  };
  populate = () => {
    this.circles = Array.from({ length: this.settings.circle_count }, () => {
      const radius = this.random(this.settings.radius_min, this.settings.radius_max);
      const x = this.random(radius, this.canvasWidth - radius);
      const y = this.random(radius, this.canvasHeight - radius);
      const vx = this.random(this.settings.speed_min, this.settings.speed_max, true);
      const vy = this.random(this.settings.speed_min, this.settings.speed_max, true);
      const vector = { x: vx, y: vy };
      const color = `hsl(${this.random(360, true)}, 50%, 50%)`;
      return new Circle(x, y, vector, radius, 1, color, color);
    });
  };
  render = (context: CanvasRenderingContext2D) => {
    this.circles.forEach((circle) => {
      circle.move(context);
      circle.draw(context);
    });
  };
}
