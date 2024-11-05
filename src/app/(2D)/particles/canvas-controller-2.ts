import { DebouncedFunc } from 'lodash';
import debounce from 'lodash/fp/debounce';

export class CanvasController {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private pixelRatio: number;
  private enableDPI: boolean;
  private resizeObserver: ResizeObserver;
  private debouncedResize: DebouncedFunc<() => void>;

  /**
   * Optional callback function that is triggered when the canvas is resized.
   *
   * @param width - The new width of the canvas.
   * @param height - The new height of the canvas.
   */
  public onResize?: (width: number, height: number) => void;

  get width() {
    return this.canvas.width / (this.enableDPI ? this.pixelRatio : 1);
  }

  get height() {
    return this.canvas.height / (this.enableDPI ? this.pixelRatio : 1);
  }

  constructor(
    canvasElement: HTMLCanvasElement,
    options: { enableDPI: boolean } = { enableDPI: false },
  ) {
    if (!(canvasElement instanceof HTMLCanvasElement))
      throw new Error('Provided element is not a canvas.');

    this.canvas = canvasElement;
    const context = this.canvas.getContext('2d');
    if (!context) throw new Error('Failed to get 2D context.');

    this.context = context;

    this.pixelRatio = window.devicePixelRatio || 1;
    this.enableDPI = options.enableDPI;

    this.debouncedResize = debounce(300, this.resizeCanvas);
    this.resizeObserver = new ResizeObserver(this.debouncedResize);

    this.resizeObserver.observe(this.canvas);
    this.initCanvas();
  }

  private initCanvas = () => {
    this.resizeCanvas();
  };

  private resizeCanvas = () => {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    this.canvas.width = width * (this.enableDPI ? this.pixelRatio : 1);
    this.canvas.height = height * (this.enableDPI ? this.pixelRatio : 1);

    if (this.enableDPI) this.context.scale(this.pixelRatio, this.pixelRatio);

    this.onResize?.(width, height);
  };

  public draw = (renderFunction: (context: CanvasRenderingContext2D) => void): void => {
    renderFunction(this.context);
  };

  /**
   * Disposes of resources used by the canvas controller.
   *
   * This method cancels any debounced resize operations and disconnects the resize observer.
   * It should be called to clean up resources when the canvas controller is no longer needed.
   */
  public dispose = () => {
    this.debouncedResize.cancel();
    this.resizeObserver.disconnect();
  };
}
