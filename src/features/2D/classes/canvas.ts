import debounce from 'lodash/fp/debounce';

export class Canvas2D {
  private _canvas: HTMLCanvasElement | null = null;
  private _context: CanvasRenderingContext2D | null = null;

  resizeDebounced: () => void;
  onResize?: () => void;

  get canvas() {
    if (!this._canvas) {
      this._canvas = this.setupCanvas();
      this.resize();
      window.addEventListener('resize', this._resizeListener);
    }
    return this._canvas;
  }

  get context() {
    if (!this._context) this._context = this.setupContext();
    return this._context;
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

  private setupCanvas() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) throw new Error('Canvas element not found');
    return canvas;
  }

  private setupContext() {
    const context = this.canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D rendering context not found');
    return context;
  }

  private _resizeListener = () => {
    this.resizeDebounced();
    this.onResize?.();
  };

  resize = () => {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  };

  destroy = () => {
    window.removeEventListener('resize', this._resizeListener);
  };
}
