/**
 * Creates an animation loop that can be started and stopped.
 *
 * @param callback - A function that will be called on each animation frame.
 *                  Receives the current timestamp as a parameter.
 * @param immediate - If true, the animation will start immediately.
 *                   If false, it needs to be started manually using the returned start function. Defaults to true.
 * @returns An object containing start and stop functions to control the animation:
 *          - start: Begins the animation loop if it's not already running
 *          - stop: Stops the animation loop if it's currently running
 *
 * @example
 * ```typescript
 * const animation = createAnimation((time) => {
 *   console.log(time);
 * });
 *
 * animation.start(); // Start the animation
 * animation.stop();  // Stop the animation
 * ```
 */
export const createAnimationController = (
  callback: (time: number) => void,
  immediate = true,
) => {
  let requestId: number | null = null;

  const loop = (time: number) => {
    callback(time);
    requestId = requestAnimationFrame(loop);
  };

  const start = () => {
    if (requestId) return;
    requestId = requestAnimationFrame(loop);
  };

  if (immediate) start();

  const stop = () => {
    if (!requestId) return;
    cancelAnimationFrame(requestId);
    requestId = null;
  };

  return { start, stop };
};
