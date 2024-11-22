import { getSwipeDirection } from '@/utils/get-swipe-direction';

type Direction = 'left' | 'right' | 'up' | 'down';
type OnMoveHandler = (direction: Direction) => void;
type TouchMoveDetectionOptions = {
  isPreventDefault?: boolean;
  threshold?: number;
};

const MIN_SWIPE_DISTANCE = 20;

export class TouchMoveDetector {
  private _target: HTMLElement;
  private _touchStartX = 0;
  private _touchStartY = 0;
  private _threshold = MIN_SWIPE_DISTANCE;
  private _isPreventDefault = true;
  private _observers: OnMoveHandler[] = [];

  static of(target: HTMLElement, options?: TouchMoveDetectionOptions) {
    return new TouchMoveDetector(target, options);
  }

  constructor(
    target: HTMLElement,
    {
      isPreventDefault = true,
      threshold = MIN_SWIPE_DISTANCE,
    }: TouchMoveDetectionOptions = {},
  ) {
    this._target = target;
    this._threshold = threshold;
    this._isPreventDefault = isPreventDefault;

    this._target.addEventListener('touchstart', this._onTouchStart);
    this._target.addEventListener('touchmove', this._onTouchMove);
  }

  observe = (onMove: OnMoveHandler) => {
    this._observers.push(onMove);
    return () => {
      this._observers = this._observers.filter((o) => o !== onMove);
    };
  };

  private _onTouchStart = (event: TouchEvent) => {
    if (this._isPreventDefault) event.preventDefault();
    const touch = event.touches[0];
    this._touchStartX = touch.clientX;
    this._touchStartY = touch.clientY;
  };

  private _onTouchMove = (event: TouchEvent) => {
    if (this._isPreventDefault) event.preventDefault();
    const touch = event.touches[0];
    const touchMoveX = touch.clientX;
    const touchMoveY = touch.clientY;

    const deltaX = touchMoveX - this._touchStartX;
    const deltaY = touchMoveY - this._touchStartY;

    const direction = getSwipeDirection(deltaX, deltaY, this._threshold);
    if (!direction) return;

    this._observers.forEach((observer) => observer(direction));

    if (direction === 'left' || direction === 'right') this._touchStartX = touchMoveX;
    if (direction === 'up' || direction === 'down') this._touchStartY = touchMoveY;
  };

  private _onTouchEnd = (event: TouchEvent) => {
    if (this._isPreventDefault) event.preventDefault();
    this._touchStartX = 0;
    this._touchStartY = 0;
  };

  dispose = () => {
    this._target.removeEventListener('touchstart', this._onTouchStart);
    this._target.removeEventListener('touchmove', this._onTouchMove);
    this._target.removeEventListener('touchend', this._onTouchEnd);
  };
}
