import debounce from 'lodash/fp/debounce';

export class Canvas {
  private _canvas: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D;

  resizeDebounced: () => void;

  get context() {
    return this._context;
  }

  get width() {
    return this._canvas.width;
  }

  get height() {
    return this._canvas.height;
  }

  constructor() {
    const { canvas, context } = this.setupCanvas();
    this._canvas = canvas;
    this._context = context;
    this.resizeDebounced = debounce(250, this.resize);
    this.resize();
  }

  private setupCanvas() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) throw new Error('Canvas element not found');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D rendering context not found');
    return { canvas, context };
  }

  resize = () => {
    this._canvas.width = this._canvas.clientWidth;
    this._canvas.height = this._canvas.clientHeight;
  };

  startResizeListener() {
    window.addEventListener('resize', this.resizeDebounced);
  }

  stopResizeListener() {
    window.removeEventListener('resize', this.resizeDebounced);
  }
}
