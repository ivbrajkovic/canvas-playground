type TypType = 'tap' | 'double-tap';
type TapHandler = (tapType: TypType, touchEvent: TouchEvent) => void;
type TapDetectionOptions = {
  isPreventDefault?: boolean;
  maxTapDistance?: number;
  doubleTapThreshold?: number;
};

const MAX_TAP_DISTANCE = 10;
const DOUBLE_TAP_THRESHOLD = 300;

export class TapDetector {
  private _target: HTMLElement;
  private _lastTapTime = 0;
  private _touchStartX = 0;
  private _touchStartY = 0;
  private _observers: TapHandler[] = [];
  private _isPreventDefault;
  private _maxTapDistance;
  private _doubleTapThreshold;

  private _tapTimeoutId: ReturnType<typeof setTimeout> | null = null;

  static of = (target: HTMLElement, options?: TapDetectionOptions) =>
    new TapDetector(target, options);

  constructor(
    target: HTMLElement,
    {
      isPreventDefault = true,
      maxTapDistance = MAX_TAP_DISTANCE,
      doubleTapThreshold = DOUBLE_TAP_THRESHOLD,
    }: TapDetectionOptions = {},
  ) {
    this._target = target;
    this._isPreventDefault = isPreventDefault;
    this._maxTapDistance = maxTapDistance;
    this._doubleTapThreshold = doubleTapThreshold;

    this._target.addEventListener('touchend', this._onTouchEnd);
    this._target.addEventListener('touchstart', this._onTouchStart);
  }

  private _onTouchStart = (event: TouchEvent) => {
    if (this._isPreventDefault) event.preventDefault();
    const touch = event.touches[0];
    this._touchStartX = touch.clientX;
    this._touchStartY = touch.clientY;
  };

  private _onTouchEnd = (event: TouchEvent) => {
    if (this._isPreventDefault) event.preventDefault();

    // Check if tap position is within the threshold
    const touch = event.changedTouches[0];
    const touchMoveX = touch.clientX;
    const touchMoveY = touch.clientY;
    const deltaX = touchMoveX - this._touchStartX;
    const deltaY = touchMoveY - this._touchStartY;

    // Check if the tap distance is within the threshold
    if (
      Math.abs(deltaX) > this._maxTapDistance ||
      Math.abs(deltaY) > this._maxTapDistance
    )
      return;

    const currentTime = Date.now();
    const timeSinceLastTap = currentTime - this._lastTapTime;

    // Clear the timeout if set
    if (this._tapTimeoutId) {
      clearTimeout(this._tapTimeoutId);
      this._tapTimeoutId = null;
    }

    // Check if it is a double tap
    if (timeSinceLastTap > 0 && timeSinceLastTap < this._doubleTapThreshold) {
      this._observers.forEach((observer) => observer('double-tap', event));
      this._lastTapTime = 0;
      return;
    }

    // Check if it is a tap
    this._lastTapTime = currentTime;
    this._tapTimeoutId = setTimeout(() => {
      this._observers.forEach((observer) => observer('tap', event));
      this._lastTapTime = 0;
      this._tapTimeoutId = null;
    }, this._doubleTapThreshold);
  };

  observe = (onTap: TapHandler): (() => void) => {
    this._observers.push(onTap);
    return () => {
      this._observers.filter((observer) => observer !== onTap);
    };
  };

  public dispose = () => {
    this._target.removeEventListener('touchend', this._onTouchEnd);
    this._target.removeEventListener('touchstart', this._onTouchStart);
  };
}
