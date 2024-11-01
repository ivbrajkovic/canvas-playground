import { assertClient } from '@/lib/assert-client';
import {
  getDistanceBetweenCoords,
  getDistanceBetweenPoints,
  Point2D,
} from '@/lib/get-distance';

export interface IMouseController {
  readonly x: number;
  readonly y: number;
  readonly coords: { x: number; y: number };
  onMouseMove?: (x: number, y: number) => void;

  init(): void;
  init(target: Element): void;
  init(x: number, y: number): void;
  init(x: number, y: number, target: Element): void;

  getDistanceFromCoords: (x: number, y: number, precise?: boolean) => number;
  getDistanceFromPoints: (point: Point2D, precise?: boolean) => number;

  dispose: () => void;
}

export class MouseController implements IMouseController {
  #x;
  #y;
  #target: Element | Window | null;
  #getDistanceBetweenCoords: (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    precise?: boolean,
  ) => number;
  getDistanceBetweenPoints: (
    point1: Point2D,
    point2: Point2D,
    precise?: boolean,
  ) => number;

  // prettier-ignore
  get x() { return this.#x; }
  // prettier-ignore
  get y() { return this.#y; }
  // prettier-ignore
  get coords() { return { x: this.#x, y: this.#y }; }

  onMouseMove?: (x: number, y: number) => void;

  constructor() {
    this.#x = 0;
    this.#y = 0;
    this.#target = null;
    this.#getDistanceBetweenCoords = getDistanceBetweenCoords;
    this.getDistanceBetweenPoints = getDistanceBetweenPoints;
  }

  init(): void;
  init(target: Element): void;
  init(x: number, y: number): void;
  init(x: number, y: number, target: Element): void;
  init(targetOrX?: Element | number, y?: number, target?: Element): void {
    assertClient(window); // Asserts that the code is running in a client-side environment

    // Determine the `x` and `y` values based on the input
    const x = typeof targetOrX === 'number' ? targetOrX : 0;
    const finalY = typeof y === 'number' ? y : 0;

    // Determine the `target` element, defaulting to `window` if not provided
    const finalTarget =
      target || (targetOrX instanceof Element ? targetOrX : window);

    this.#x = x;
    this.#y = finalY;
    this.#target = finalTarget;
    this.#addMousemoveListener();
  }

  #handleMousemove = (e: MouseEvent) => {
    this.#x = e.clientX;
    this.#y = e.clientY;
    this.onMouseMove?.(this.#x, this.#y);
  };

  #addMousemoveListener = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.#target?.addEventListener('mousemove', this.#handleMousemove as any);
  };

  #removeMousemoveListener = () => {
    this.#target?.removeEventListener(
      'mousemove',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.#handleMousemove as any,
    );
  };

  getDistanceFromCoords = (x: number, y: number, precise?: boolean) => {
    return this.#getDistanceBetweenCoords(this.#x, this.#y, x, y, precise);
  };

  getDistanceFromPoints = (point: Point2D, precise?: boolean) => {
    return this.getDistanceBetweenPoints(this.coords, point, precise);
  };

  dispose = () => {
    this.#removeMousemoveListener();
  };
}
