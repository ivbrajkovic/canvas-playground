export class MouseController {
  #canvas: HTMLCanvasElement | null = null;
  #isMouseDown = false;
  #mouse = { x: 0, y: 0 };
  #mouseDown = { x: 0, y: 0 };
  #mouseUp = { x: 0, y: 0 };
  #mouseMove = { x: 0, y: 0 };

  get isMouseDown() {
    return this.#isMouseDown;
  }

  get mouse() {
    return this.#mouse;
  }

  get mouseDown() {
    return this.#mouseDown;
  }

  get mouseUp() {
    return this.#mouseUp;
  }

  get mouseMove() {
    return this.#mouseMove;
  }

  init = (canvas: HTMLCanvasElement) => {
    this.#canvas = canvas;
    this.#canvas.addEventListener('mousedown', this.#onMouseDown);
    this.#canvas.addEventListener('mouseup', this.#onMouseUp);
    this.#canvas.addEventListener('mousemove', this.#onMouseMove);
  };

  dispose = () => {
    if (!this.#canvas) return;
    this.#canvas.removeEventListener('mousedown', this.#onMouseDown);
    this.#canvas.removeEventListener('mouseup', this.#onMouseUp);
    this.#canvas.removeEventListener('mousemove', this.#onMouseMove);
  };

  #onMouseDown = (event: MouseEvent) => {
    this.#isMouseDown = true;
    this.#mouseDown = this.#getMousePosition(event);
  };

  #onMouseUp = (event: MouseEvent) => {
    this.#isMouseDown = false;
    this.#mouseUp = this.#getMousePosition(event);
  };

  #onMouseMove = (event: MouseEvent) => {
    this.#mouseMove = this.#getMousePosition(event);
  };

  #getMousePosition = (event: MouseEvent) => {
    if (!this.#canvas) throw new Error('Canvas not initialized');
    const rect = this.#canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };
}
