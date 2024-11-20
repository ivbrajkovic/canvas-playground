type TypType = 'tap' | 'double-tap';
type TapInfo = {
  x: number;
  y: number;
  target: HTMLElement;
  event: TouchEvent;
};
type TapHandler = (tapType: TypType, tapInfo: TapInfo) => void;
type TapDetectionOptions = {
  threshold?: number;
  isPreventDefault?: boolean;
};

const MIN_TAP_INTERVAL = 300;

export class TapDetectorObserver {
  private _target: HTMLElement;
  private _lastTap = 0;
  private _observers: TapHandler[] = [];
  private _threshold;
  private _isPreventDefault;

  static of = (target: HTMLElement, options?: TapDetectionOptions) =>
    new TapDetectorObserver(target, options);

  constructor(target: HTMLElement, options?: TapDetectionOptions) {
    this._target = target;
    this._threshold = options?.threshold ?? MIN_TAP_INTERVAL;
    this._isPreventDefault = options?.isPreventDefault ?? true;
    this._target.addEventListener('touchend', this._onTouchEnd);
  }

  private _getTapType = (now: number): TypType => {
    const isDoubleTap = now - this._lastTap < this._threshold;
    return isDoubleTap ? 'double-tap' : 'tap';
  };

  private _getTypeInfo = (event: TouchEvent): TapInfo => {
    const touch = event.changedTouches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    const target = touch.target as HTMLElement;
    return { x, y, target, event };
  };

  private _notifyObservers = (tapType: TypType, tapInfo: TapInfo) => {
    this._observers.forEach((observer) => observer(tapType, tapInfo));
  };

  private _unobserve = (onTap: TapHandler) => {
    this._observers = this._observers.filter((observer) => observer !== onTap);
  };

  private _onTouchEnd = (event: TouchEvent) => {
    if (this._isPreventDefault) event.preventDefault();
    const now = Date.now();
    const tapType = this._getTapType(now);
    const tapInfo = this._getTypeInfo(event);
    this._notifyObservers(tapType, tapInfo);
    this._lastTap = now;
  };

  observe = (onTap: (tap: TypType, info: TapInfo) => void): (() => void) => {
    this._observers.push(onTap);
    return () => this._unobserve(onTap);
  };

  public dispose = () => {
    this._target.removeEventListener('touchend', this._onTouchEnd);
  };
}
