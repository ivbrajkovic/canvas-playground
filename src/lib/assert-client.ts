/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Asserts that the code is running in a client-side environment
 * @throws {Error} If code is not running in a browser environment
 */
export function assertClient(window: any): asserts window is Window {
  if (typeof window === 'undefined') {
    throw new Error('This code can only run in a browser environment');
  }
}
