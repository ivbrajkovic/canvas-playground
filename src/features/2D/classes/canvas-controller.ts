import debounce from 'lodash/fp/debounce';

export class CanvasController {
  #canvas: HTMLCanvasElement | null = null;
  #context: CanvasRenderingContext2D | null = null;

  resizeDebounced: () => void;
  onResize?: () => void;

  get canvas() {
    if (!this.#canvas) throw new Error('Canvas controller not initialized');
    return this.#canvas;
  }

  get context() {
    if (!this.#context) throw new Error('Canvas controller not initialized');
    return this.#context;
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  constructor() {
    this.resizeDebounced = debounce(250, this.resize);
  }

  #resizeListener = () => {
    this.resizeDebounced();
    this.onResize?.();
  };

  #addResizeEventListener = () => {
    window.addEventListener('resize', this.#resizeListener);
  };

  #removeResizeEventListener = () => {
    window.removeEventListener('resize', this.#resizeListener);
  };

  init = (elementId = 'canvas') => {
    const canvas = document.getElementById(elementId) as HTMLCanvasElement;
    if (!canvas) throw new Error('Canvas element not found');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D rendering context not found');
    this.#canvas = canvas;
    this.#context = context;
    this.resize();
    this.#addResizeEventListener();
  };

  resize = () => {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  };

  contextReset = () => {
    this.context.reset();
  };

  dispose = () => {
    console.log('CanvasController.dispose');

    this.#removeResizeEventListener();
    this.context.reset();
    this.#canvas = null;
    this.#context = null;
  };
}
