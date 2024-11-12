/**
 * Resizes a canvas element and its context to account for device pixel ratio and display scaling.
 *
 * @param canvas - The HTML canvas element to resize
 * @param context - The 2D rendering context of the canvas
 * @param width - The desired width in CSS pixels (defaults to canvas client width)
 * @param height - The desired height in CSS pixels (defaults to canvas client height)
 * @param scale - The scaling factor to apply (defaults to device pixel ratio)
 * @returns - Returns true if the canvas was resized, false if no resize was needed
 *
 * @description
 * This function handles:
 * 1. Setting the display size (CSS pixels)
 * 2. Setting the actual canvas memory size (accounting for device pixel ratio)
 * 3. Normalizing the coordinate system to use CSS pixels
 *
 * The function helps prevent blurry canvas rendering on high DPI displays by properly
 * scaling the canvas dimensions and coordinate system.
 */
export const resizeCanvas = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  width = canvas.clientWidth,
  height = canvas.clientHeight,
  scale: number = window.devicePixelRatio || 1,
) => {
  // Calculate the scaled canvas dimensions.
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  // Check if the canvas dimensions match the new dimensions.
  if (canvas.width === scaledWidth && canvas.height === scaledHeight) return false;

  // Set display size (CSS pixels).
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  // Set actual size in memory (scaled to account for extra pixel density).
  canvas.width = Math.floor(scaledWidth);
  canvas.height = Math.floor(scaledHeight);

  // Normalize coordinate system to use CSS pixels.
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.scale(scale, scale);

  return true;
};
