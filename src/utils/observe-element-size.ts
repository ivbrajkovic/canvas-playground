import debounce from 'lodash/fp/debounce';

/**
 * Observes changes in the size of a given HTML element and handles these changes with a debounced callback.
 *
 * @param element - The HTML element to observe for size changes
 * @param handler - Callback function that will be called when the element's size changes
 * @param debounceTime - Time in milliseconds to debounce the handler callback (default: 300ms)
 * @returns A cleanup function that stops observing the element and cancels any pending debounced callbacks
 *
 * @example
 * ```typescript
 * const cleanup = observeElementSize(myDiv, (entries) => {
 *   console.log('Element size changed:', entries[0].contentRect);
 * });
 *
 * // Later: cleanup when no longer needed
 * cleanup();
 * ```
 */
export const observeElementSize = <T extends HTMLElement>(
  element: T,
  handler: ResizeObserverCallback,
  debounceTime: number = 300,
) => {
  const debouncedHandler = debounce(debounceTime, handler);
  const resizeObserver = new ResizeObserver(debouncedHandler);
  resizeObserver.observe(element);
  return () => {
    debouncedHandler.cancel();
    resizeObserver.disconnect();
  };
};
