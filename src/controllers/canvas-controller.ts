/**
 * Clears the entire canvas, resetting any transformations.
 *
 * @param context - The canvas rendering context to clear.
 */
export const clearCanvas = (context: CanvasRenderingContext2D) => {
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0); // Reset transformation
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.restore();
};

/**
 * Resizes a canvas to match its display size, optionally handling DPI scaling
 * @param canvas - The canvas element to resize
 * @param context - The rendering context of the canvas
 * @param enableDPI - Whether to enable high DPI scaling
 * @param pixelRatio - The pixel ratio to use (defaults to device pixel ratio)
 */
export const resizeCanvas = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  enableDPI: boolean = false,
  pixelRatio: number = window.devicePixelRatio || 1,
) => {
  const width = canvas.clientWidth * (enableDPI ? pixelRatio : 1);
  const height = canvas.clientHeight * (enableDPI ? pixelRatio : 1);

  canvas.width = width;
  canvas.height = height;

  if (enableDPI) {
    // Reset the transformation matrix to the identity matrix before scaling
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(pixelRatio, pixelRatio);
  }
};

/**
 * Initializes the canvas element and its 2D rendering context.
 *
 * @param canvas - The HTMLCanvasElement to initialize. If null, an error is thrown.
 * @param enableDPI - A boolean flag to enable or disable DPI scaling. Defaults to false.
 * @returns An object containing the initialized canvas and its 2D context.
 * @throws Will throw an error if the canvas element is not found or if the 2D context cannot be obtained.
 */
export const initCanvas = (
  canvas: HTMLCanvasElement | null,
  enableDPI: boolean = false,
) => {
  if (!canvas) throw new Error('Canvas element not found');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Failed to get 2D context');
  resizeCanvas(canvas, context, enableDPI);
  return { canvas, context };
};
