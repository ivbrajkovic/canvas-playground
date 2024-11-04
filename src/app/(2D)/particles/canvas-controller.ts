import debounce from 'lodash/fp/debounce';

export class CanvasController {
  private _canvas: HTMLCanvasElement;
  private _resizeObserver: ResizeObserver;
  private _context: CanvasRenderingContext2D;
  private _devicePixelRatio: number;
  private _isInitialResize = true;
  private _onMouseMove: ((event: MouseEvent) => void) | null = null;

  onResize?: (width: number, height: number) => void;

  set onMouseMove(value: ((width: number, height: number) => void) | null) {
    if (value) this._addMouseMoveListener(value);
    else this._removeMouseMoveListener();
  }

  constructor(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D rendering context not found');

    this._canvas = canvas;
    this._context = context;
    // this._devicePixelRatio = window.devicePixelRatio || 1;
    this._devicePixelRatio = 3;

    this._resize(canvas.clientWidth, canvas.clientHeight);

    this._resizeObserver = new ResizeObserver(this._resizeObserverCallback);
    this._resizeObserver.observe(this._canvas);
  }

  // prettier-ignore
  get context() { return this._context; }
  // prettier-ignore
  get width() { return this._canvas.width / this._devicePixelRatio; }
  // prettier-ignore
  get height() { return this._canvas.height / this._devicePixelRatio }
  // prettier-ignore
  get parentElement() { return this._canvas.parentElement!; }

  /**
   * Resizes the canvas element and adjusts for device pixel ratio.
   * @param width - The new width of the canvas in CSS pixels.
   * @param height - The new height of the canvas in CSS pixels.
   */
  private _resize = (width: number, height: number) => {
    // Adjust for DPI
    const dpiWidth = width * this._devicePixelRatio;
    const dpiHeight = height * this._devicePixelRatio;

    // Set canvas size
    this._canvas.width = dpiWidth;
    this._canvas.height = dpiHeight;

    // Scale context to normalize drawing operations
    this._context.resetTransform();
    this._context.scale(this._devicePixelRatio, this._devicePixelRatio);
  };

  private _resizeListener = debounce(250, (width: number, height: number) => {
    this._resize(width, height);
    this.onResize?.(width, height);
  });

  private _resizeObserverCallback = (entries: ResizeObserverEntry[]) => {
    if (this._isInitialResize) {
      this._isInitialResize = false;
      return;
    }
    entries.forEach((entry) => {
      const { width, height } = entry.contentRect;
      this._resizeListener(width, height);
    });
  };

  private _addMouseMoveListener(callback: (x: number, y: number) => void) {
    if (this._onMouseMove) this._removeMouseMoveListener();
    this._onMouseMove = (event: MouseEvent) => {
      const x = event.offsetX * this._devicePixelRatio;
      const y = event.offsetY * this._devicePixelRatio;
      callback(x, y);
    };
    this._canvas.addEventListener('mousemove', this._onMouseMove);
  }

  private _removeMouseMoveListener() {
    if (!this._onMouseMove) return;
    this._canvas.removeEventListener('mousemove', this._onMouseMove);
    this._onMouseMove = null;
  }

  dispose = () => {
    this._removeMouseMoveListener();
    this._resizeObserver.disconnect();
    this._resizeListener.cancel();
    this._context.reset();
    this._canvas = undefined!;
    this._context = undefined!;
    this._resizeObserver = undefined!;
    this.onResize = undefined!;
  };
}
