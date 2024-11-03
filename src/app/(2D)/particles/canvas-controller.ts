import debounce from 'lodash/fp/debounce';

export class CanvasController {
  private _canvas: HTMLCanvasElement;
  private _resizeObserver!: ResizeObserver;
  private _context: CanvasRenderingContext2D;

  onResize?: (width: number, height: number) => void;

  constructor(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D rendering context not found');

    this._canvas = canvas;
    this._context = context;
    this._resize();
    this._createResizeObserver();
  }

  // prettier-ignore
  get context() { return this._context; }
  // prettier-ignore
  get width() { return this._canvas.width; }
  // prettier-ignore
  get height() { return this._canvas.height; }

  private _resizeListener = debounce(250, (width: number, height: number) => {
    this._canvas.width = width;
    this._canvas.height = height;
    this.onResize?.(width, height);
  });

  private _createResizeObserver = () => {
    this._resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        this._resizeListener(width, height);
      }
    });
    this._resizeObserver.observe(this._canvas);
  };

  private _resize = (width?: number, height?: number) => {
    this._canvas.width = width ?? this._canvas.clientWidth;
    this._canvas.height = height ?? this._canvas.clientHeight;
  };

  resize = (width: number, height: number) => {
    this._resize(width, height);
  };

  dispose = () => {
    this._resizeObserver.disconnect();
    this._context.reset();
  };
}
