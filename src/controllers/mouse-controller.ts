import { assertClient } from '@/lib/assert-client';
import { getDistance, Point2D } from '@/lib/get-distance';

export class MouseController {
  #x = 0;
  #y = 0;
  #target: Element | Window | null = null;

  // prettier-ignore
  get x() { return this.#x; }
  // prettier-ignore
  get y() { return this.#y; }
  // prettier-ignore
  get position() { return { x: this.#x, y: this.#y }; }

  onMouseMove?: (x: number, y: number) => void;

  init = (x: number, y: number, target: Element | null = null) => {
    assertClient(window); // Asserts that the code is running in a client-side environment
    this.#x = x;
    this.#y = y;
    this.#target = target || window;
    this.#addMousemoveListener();
  };

  handleMousemove = (e: MouseEvent) => {
    this.#x = e.clientX;
    this.#y = e.clientY;
    this.onMouseMove?.(this.#x, this.#y);
  };

  #addMousemoveListener = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.#target?.addEventListener('mousemove', this.handleMousemove as any);
  };

  #removeMousemoveListener = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.#target?.removeEventListener('mousemove', this.handleMousemove as any);
  };

  getDistance(point: Point2D) {
    return getDistance(this.position, point);
  }

  dispose = () => {
    this.#removeMousemoveListener();
  };
}
