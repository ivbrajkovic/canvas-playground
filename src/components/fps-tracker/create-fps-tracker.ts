const ONE_SECOND = 1000;

/**
 * Creates an FPS (Frames Per Second) tracker function that monitors frame rates.
 *
 * The returned function should be called on each animation frame to track FPS.
 * The FPS value is calculated based on the number of frames within the specified interval
 * and reported via the callback function.
 *
 * @param updateFpsCallback - Callback function that receives the calculated FPS value
 * @param intervalMs - The interval in milliseconds between FPS calculations. Defaults to 1000ms (1 second)
 * @returns A tracking function that should be called on each animation frame
 *
 * @example
 * ```typescript
 * const tracker = createFpsTracker((fps) => console.log(`Current FPS: ${fps}`));
 *
 * function animate() {
 *   tracker();
 *   requestAnimationFrame(animate);
 * }
 * animate();
 * ```
 */
export const createFpsTracker = (
  updateFpsCallback: (fps: number) => void,
  intervalMs: number = ONE_SECOND,
) => {
  let frameCount = 0;
  let lastFrameTime = performance.now();

  /**
   * Tracks a single frame. Should be called once per animation frame.
   */
  const track = () => {
    frameCount++;
    const now = performance.now();
    if (now - lastFrameTime < intervalMs) return;

    const deltaSeconds = (now - lastFrameTime) / 1000; // Convert seconds
    const fps = frameCount / deltaSeconds;
    updateFpsCallback(~~fps); // Invoke callback with FPS value

    // Reset for the next cycle
    frameCount = 0;
    lastFrameTime = now;
  };

  return track;
};
