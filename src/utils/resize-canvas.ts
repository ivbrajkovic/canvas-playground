/**
 * Resizes a canvas element and its context to match the client dimensions while optionally handling DPI scaling.
 *
 * @param canvas - The HTML canvas element to be resized
 * @param context - The 2D rendering context of the canvas
 * @param enableDPI - Optional flag to enable high DPI scaling (default: false)
 * @param pixelRatio - Optional device pixel ratio for scaling (default: window.devicePixelRatio || 1)
 * @returns True if the canvas was resized, false otherwise
 *
 * @remarks
 * When enableDPI is true, the canvas will be scaled according to the device's pixel ratio,
 * ensuring sharp rendering on high DPI displays. The context's transformation matrix is
 * reset before applying the DPI scaling.
 *
 * @example
 * ```typescript
 * const canvas = document.querySelector('canvas');
 * const context = canvas.getContext('2d');
 * resizeCanvas(canvas, context, true);
 * ```
 */
export const resizeCanvas = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  enableDPI: boolean = false,
  pixelRatio: number = window.devicePixelRatio || 1,
) => {
  const width = canvas.clientWidth * (enableDPI ? pixelRatio : 1);
  const height = canvas.clientHeight * (enableDPI ? pixelRatio : 1);

  if (canvas.width === width && canvas.height === height) return false;

  canvas.width = width;
  canvas.height = height;

  if (enableDPI) {
    // Reset the transformation matrix to the identity matrix before scaling
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(pixelRatio, pixelRatio);
  }

  return true;
};
