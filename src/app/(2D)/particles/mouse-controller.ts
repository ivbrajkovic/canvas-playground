export class MouseController {
  #canvas: HTMLCanvasElement | null = null;
  #isMouseDown = false;
  #mouse = { x: 0, y: 0 };
  #mouseDown = { x: 0, y: 0 };
  #mouseUp = { x: 0, y: 0 };
  #mouseMove = { dx: 0, dy: 0 };
  #lastMousePosition = { x: 0, y: 0 };
  #radius = 10;
  #minRadius = 5;
  #maxRadius = 100;
  #enableDPI: boolean;
  #pixelRatio: number;

  /**
   * Creates an instance of MouseController.
   * @param enableDPI Whether to account for screen DPI scaling.
   */
  constructor(enableDPI = false) {
    this.#enableDPI = enableDPI;
    this.#pixelRatio = window.devicePixelRatio || 1;
  }

  get isMouseDown() {
    return this.#isMouseDown;
  }

  /**
   * Current mouse position relative to the canvas.
   */
  get mouse() {
    return this.#mouse;
  }

  /**
   * Position where the mouse button was last pressed.
   */
  get mouseDown() {
    return this.#mouseDown;
  }

  /**
   * Position where the mouse button was last released.
   */
  get mouseUp() {
    return this.#mouseUp;
  }

  /**
   * Delta movement of the mouse since the last event.
   */
  get mouseMove() {
    return this.#mouseMove;
  }

  /**
   * Getter for the radius.
   */
  get radius() {
    return this.#radius;
  }

  /**
   * Setter for the radius.
   * Ensures the radius stays within minRadius and maxRadius.
   * @param value The new radius value.
   */
  set radius(value: number) {
    if (value < this.#minRadius) this.#radius = this.#minRadius;
    else if (value > this.#maxRadius) this.#radius = this.#maxRadius;
    else this.#radius = value;
  }

  /**
   * Initializes the MouseController with a canvas element.
   * Sets up event listeners for mouse events.
   * @param canvas The HTMLCanvasElement to attach mouse events to.
   */
  init(canvas: HTMLCanvasElement) {
    if (this.#canvas) {
      console.warn('MouseController is already initialized.');
      return;
    }
    this.#canvas = canvas;
    this.#canvas.addEventListener('mousedown', this.#onMouseDown);
    this.#canvas.addEventListener('mouseup', this.#onMouseUp);
    this.#canvas.addEventListener('mousemove', this.#onMouseMove);
  }

  /**
   * Removes event listeners and cleans up references.
   */
  dispose() {
    if (!this.#canvas) return;
    this.#canvas.removeEventListener('mousedown', this.#onMouseDown);
    this.#canvas.removeEventListener('mouseup', this.#onMouseUp);
    this.#canvas.removeEventListener('mousemove', this.#onMouseMove);
    this.#canvas = null;
  }

  #onMouseDown = (event: MouseEvent) => {
    this.#isMouseDown = true;
    this.#mouseDown = this.#getMousePosition(event);
  };

  #onMouseUp = (event: MouseEvent) => {
    this.#isMouseDown = false;
    this.#mouseUp = this.#getMousePosition(event);
  };

  #onMouseMove = (event: MouseEvent) => {
    const currentPosition = this.#getMousePosition(event);
    this.#mouseMove = {
      dx: currentPosition.x - this.#lastMousePosition.x,
      dy: currentPosition.y - this.#lastMousePosition.y,
    };
    this.#mouse = currentPosition;
    this.#lastMousePosition = currentPosition;
  };

  #getMousePosition(event: MouseEvent) {
    if (!this.#canvas) {
      console.error('MouseController: Canvas not initialized.');
      return { x: 0, y: 0 };
    }

    let x = event.offsetX;
    let y = event.offsetY;

    if (this.#enableDPI) {
      x *= this.#pixelRatio;
      y *= this.#pixelRatio;
    }

    return { x, y };
  }
}
