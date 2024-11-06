import debounce from 'lodash/fp/debounce';

/**
 * Observes the size of an HTML element and invokes a handler when it changes.
 * The handler is debounced to prevent it from firing too frequently.
 *
 * @typeParam T - The type of the HTML element being observed.
 * @param element - The HTML element to observe for size changes.
 * @param handler - The function to call when the element's size changes.
 * @param debounceTime - The number of milliseconds to debounce the handler. Defaults to `300`.
 * @returns A function to stop observing the element and cancel the debounced handler.
 */
export const observeElementSize = <T extends HTMLElement>(
  element: T,
  handler: () => void,
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
