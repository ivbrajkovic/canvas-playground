/**
 * Represents the position of the mouse cursor.
 *
 * @property {number} x - The x-coordinate of the mouse position.
 * @property {number} y - The y-coordinate of the mouse position.
 */
type MousePosition = { x: number; y: number };

/**
 * Represents the change in mouse position.
 *
 * @typedef {Object} MouseDelta
 * @property {number} dx - The change in the x-coordinate.
 * @property {number} dy - The change in the y-coordinate.
 */
type MouseDelta = { dx: number; dy: number };

/**
 * Interface representing handlers for mouse events.
 */
interface MouseEventHandlers {
  /**
   * Handler for the mouse down event.
   * @param position - The position of the mouse when the event occurs.
   */
  onMouseDown?: (position: MousePosition) => void;

  /**
   * Handler for the mouse up event.
   * @param position - The position of the mouse when the event occurs.
   */
  onMouseUp?: (position: MousePosition) => void;

  /**
   * Handler for the mouse move event.
   * @param position - The current position of the mouse.
   * @param delta - The change in position since the last mouse move event.
   */
  onMouseMove?: (position: MousePosition, delta: MouseDelta) => void;
}

/**
 * Creates a mouse controller for a given canvas element.
 *
 * @param canvas - The HTMLCanvasElement to attach mouse event listeners to.
 * @param handlers - An optional object containing mouse event handler functions.
 * @param handlers.onMouseDown - Function to call when the mouse button is pressed down.
 * @param handlers.onMouseUp - Function to call when the mouse button is released.
 * @param handlers.onMouseMove - Function to call when the mouse is moved.
 * @param enableDPI - A boolean indicating whether to enable DPI scaling for mouse positions.
 * @param pixelRatio - The pixel ratio to use for DPI scaling. Defaults to `window.devicePixelRatio` or 1.
 * @returns An object containing the current mouse state and a dispose function to remove event listeners.
 * @returns {boolean} isMouseDown - Indicates whether the mouse button is currently pressed.
 * @returns {MousePosition} mousePosition - The current mouse position.
 * @returns {Function} dispose - A function to remove the event listeners from the canvas.
 */
export const createMouseController = (
  canvas: HTMLCanvasElement,
  handlers: MouseEventHandlers = {},
  enableDPI: boolean = false,
  pixelRatio: number = window.devicePixelRatio || 1,
) => {
  let isMouseDown = false;
  let mousePosition: MousePosition = { x: 0, y: 0 };
  let lastMousePosition: MousePosition = { x: 0, y: 0 };

  const getMousePosition = (event: MouseEvent): MousePosition => {
    let x = event.offsetX;
    let y = event.offsetY;

    if (enableDPI) {
      x *= pixelRatio;
      y *= pixelRatio;
    }

    return { x, y };
  };

  const onMouseDown = (event: MouseEvent) => {
    isMouseDown = true;
    const position = getMousePosition(event);
    mousePosition = position;
    lastMousePosition = position;
    handlers.onMouseDown?.(position);
  };

  const onMouseUp = (event: MouseEvent) => {
    isMouseDown = false;
    const position = getMousePosition(event);
    mousePosition = position;
    handlers.onMouseUp?.(position);
  };

  const onMouseMove = (event: MouseEvent) => {
    const position = getMousePosition(event);
    const delta = {
      dx: position.x - lastMousePosition.x,
      dy: position.y - lastMousePosition.y,
    };
    mousePosition = position;
    lastMousePosition = position;
    handlers.onMouseMove?.(position, delta);
  };

  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('mousemove', onMouseMove);

  // Cleanup function to remove event listeners
  const dispose = () => {
    canvas.removeEventListener('mousedown', onMouseDown);
    canvas.removeEventListener('mouseup', onMouseUp);
    canvas.removeEventListener('mousemove', onMouseMove);
  };

  return {
    get isMouseDown() {
      return isMouseDown;
    },
    get mousePosition() {
      return mousePosition;
    },
    dispose,
  };
};
