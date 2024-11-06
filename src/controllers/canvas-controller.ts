import { observeElementSize } from '@/utils/observe-element-size';
import { resizeCanvas } from '@/utils/resize-canvas';

export class CanvasController {
  private enableDPI: boolean;
  private cleanupResizeObserver: () => void;

  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;

  public onResize?: () => void;

  static of = (canvas: HTMLCanvasElement | null, enableDPI?: boolean) =>
    new CanvasController(canvas, enableDPI);

  private constructor(canvas: HTMLCanvasElement | null, enableDPI = false) {
    if (!canvas) throw console.error('Canvas element not found');
    const context = canvas.getContext('2d');
    if (!context) throw console.error('Canvas context not found');

    this.canvas = canvas;
    this.enableDPI = enableDPI;
    this.context = context;

    this.resize();

    this.cleanupResizeObserver = observeElementSize(canvas, this.resize);
  }

  public resize = () => {
    const isResized = resizeCanvas(this.canvas, this.context, this.enableDPI);
    if (isResized) this.onResize?.();
  };

  public dispose = () => {
    this.cleanupResizeObserver();
  };
}
