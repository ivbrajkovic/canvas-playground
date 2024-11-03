export class Mouse {
  target: HTMLElement | null = null;

  onMouseMove?: (x: number, y: number) => void;

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

  mousemove = (event: MouseEvent) => {
    this.x = event.offsetX;
    this.y = event.offsetY;
    this.onMouseMove?.(this.x, this.y);
  };

  addMoveListener = (
    target: HTMLElement,
    listener?: (x: number, y: number) => void,
  ) => {
    this.target = target;
    this.onMouseMove = listener;
    target.addEventListener('mousemove', this.mousemove);
  };

  removeMoveListener() {
    this.target?.removeEventListener('mousemove', this.mousemove);
  }

  dispose() {
    this.removeMoveListener();
  }
}
