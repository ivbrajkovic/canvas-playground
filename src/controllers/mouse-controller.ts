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
 * @property {number} dx - The change in the x-coordinate.
 * @property {number} dy - The change in the y-coordinate.
 */
type MouseDelta = { dx: number; dy: number };

/**
 * Interface representing handlers for mouse events.
 */
type MouseEventHandlers = {
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
};

export class MouseController {
  private _isMouseDown = false;
  private _mousePosition: MousePosition = { x: 0, y: 0 };
  private _previousMousePosition: MousePosition = { x: 0, y: 0 };
  private _targetElement: HTMLElement;
  private _handlers: MouseEventHandlers;
  private _enableDPI: boolean;
  private _pixelRatio: number;

  static of = (
    targetElement: HTMLElement,
    handlers?: MouseEventHandlers,
    enableDPI?: boolean,
    pixelRatio?: number,
  ) => new MouseController(targetElement, handlers, enableDPI, pixelRatio);

  constructor(
    targetElement: HTMLElement,
    handlers: MouseEventHandlers = {},
    enableDPI = false,
    pixelRatio = window.devicePixelRatio || 1,
  ) {
    this._targetElement = targetElement;
    this._handlers = handlers;
    this._enableDPI = enableDPI;
    this._pixelRatio = pixelRatio;

    this._addEventListeners();
  }

  private _addEventListeners() {
    this._targetElement.addEventListener('mousedown', this._onMouseDown);
    this._targetElement.addEventListener('mouseup', this._onMouseUp);
    this._targetElement.addEventListener('mousemove', this._onMouseMove);
  }

  private _onMouseDown = (event: MouseEvent) => {
    this._isMouseDown = true;
    this._updateMousePosition(event);
    this._handlers.onMouseDown?.(this._mousePosition);
  };

  private _onMouseUp = (event: MouseEvent) => {
    this._isMouseDown = false;
    this._updateMousePosition(event);
    this._handlers.onMouseUp?.(this._mousePosition);
  };

  private _onMouseMove = (event: MouseEvent) => {
    this._updateMousePosition(event);
    this._handlers.onMouseMove?.(this._mousePosition, this._getMouseDelta());
  };

  private _updateMousePosition(event: MouseEvent) {
    const rect = this._targetElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this._mousePosition = this._enableDPI
      ? { x: x * this._pixelRatio, y: y * this._pixelRatio }
      : { x, y };
  }

  private _getMouseDelta(): MouseDelta {
    const dx = this._mousePosition.x - this._previousMousePosition.x;
    const dy = this._mousePosition.y - this._previousMousePosition.y;

    this._previousMousePosition = { ...this._mousePosition };

    return { dx, dy };
  }

  dispose() {
    this._targetElement.removeEventListener('mousedown', this._onMouseDown);
    this._targetElement.removeEventListener('mouseup', this._onMouseUp);
    this._targetElement.removeEventListener('mousemove', this._onMouseMove);
  }

  get isMouseDown() {
    return this._isMouseDown;
  }

  get targetElement() {
    return this._targetElement;
  }

  set targetElement(value: HTMLElement) {
    this.dispose();
    this._targetElement = value;
    this._addEventListeners();
  }

  get enableDPI() {
    return this._enableDPI;
  }

  set enableDPI(value: boolean) {
    this._enableDPI = value;
  }

  set handlers(value: MouseEventHandlers) {
    this._handlers = value;
  }

  set onMousedown(handler: (position: MousePosition) => void) {
    this._handlers.onMouseDown = handler;
  }

  set onMouseup(handler: (position: MousePosition) => void) {
    this._handlers.onMouseUp = handler;
  }

  set onMousemove(handler: (position: MousePosition, delta: MouseDelta) => void) {
    this._handlers.onMouseMove = handler;
  }

  get pixelRatio() {
    return this._pixelRatio;
  }

  set pixelRatio(value: number) {
    this._pixelRatio = value;
  }

  get x() {
    return this._mousePosition.x;
  }

  get y() {
    return this._mousePosition.y;
  }

  get dx() {
    return this._mousePosition.x - this._previousMousePosition.x;
  }

  get dy() {
    return this._mousePosition.y - this._previousMousePosition.y;
  }

  get delta() {
    return { dx: this.dx, dy: this.dy };
  }

  get position() {
    return this._mousePosition;
  }

  get previousPosition() {
    return this._previousMousePosition;
  }
}
