import { observeElementSize } from '@/utils/observe-element-size';

export class CanvasController {
  private _enableDPI: boolean;
  private _pixelRatio: number;
  private _width: number;
  private _height: number;
  private _canvas: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D;
  private _cleanupResizeObserver: () => void;

  public onResize?: () => void;

  static of = (canvas: HTMLCanvasElement | null, enableDPI?: boolean) =>
    new CanvasController(canvas, enableDPI);

  private constructor(canvas: HTMLCanvasElement | null, enableDPI = true) {
    if (!canvas) throw console.error('Canvas element not found');
    const context = canvas.getContext('2d');
    if (!context) throw console.error('Canvas context not found');

    this._canvas = canvas;
    this._context = context;
    this._enableDPI = enableDPI;
    this._pixelRatio = window.devicePixelRatio || 1;

    const scaleFactor = this._enableDPI ? this._pixelRatio : 1;
    const clientWidth = this._canvas.clientWidth * scaleFactor;
    const clientHeight = this._canvas.clientHeight * scaleFactor;
    this._width = clientWidth / scaleFactor;
    this._height = clientHeight / scaleFactor;
    this._resize();

    this._cleanupResizeObserver = observeElementSize(canvas, this._resize);
  }

  private _resize = () => {
    const scaleFactor = this._enableDPI ? this._pixelRatio : 1;
    const clientWidth = this._canvas.clientWidth * scaleFactor;
    const clientHeight = this._canvas.clientHeight * scaleFactor;

    if (this._canvas.width !== clientWidth || this._canvas.height !== clientHeight) {
      this._canvas.width = clientWidth;
      this._canvas.height = clientHeight;

      // Reset the transformation matrix to the identity matrix before scaling
      this._context.setTransform(1, 0, 0, 1, 0, 0);
      this._context.scale(this._pixelRatio, this._pixelRatio);

      this._width = clientWidth / scaleFactor;
      this._height = clientHeight / scaleFactor;
      this.onResize?.();
    }
  };

  public dispose = () => {
    this._cleanupResizeObserver();
  };

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get canvas() {
    return this._canvas;
  }

  get context() {
    return this._context;
  }
}
