import {
  Direction,
  getSwipeDirection,
  swipeDir,
  swipeLeftOrRight,
  swipeUpOrDown,
} from '@/utils/get-swipe-direction';

const MIN_SWIPE_DISTANCE = 50;

type Handlers = {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
};

type SwipeDetectionOptions = {
  target: HTMLElement;
  threshold?: number;
  handlers: Handlers;
  isPreventDefault?: boolean;
};

export const swipeDetection = ({
  target,
  isPreventDefault = true,
  threshold = MIN_SWIPE_DISTANCE,
  handlers,
}: SwipeDetectionOptions) => {
  let touchStartX = 0;
  let touchStartY = 0;

  const onTouchStart = (event: TouchEvent) => {
    if (isPreventDefault) event.preventDefault();
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  };

  const onTouchEnd = (event: TouchEvent) => {
    if (isPreventDefault) event.preventDefault();

    const touch = event.changedTouches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    const direction = swipeDir(deltaX, deltaY);

    if (direction === 'horizontal') {
      const horizontalMove = swipeLeftOrRight(deltaX, threshold);
      if (horizontalMove === 'left') handlers.onSwipeLeft();
      if (horizontalMove === 'right') handlers.onSwipeRight();
    } else if (direction === 'vertical') {
      const verticalMove = swipeUpOrDown(deltaY, threshold);
      if (verticalMove === 'up') handlers.onSwipeUp();
      if (verticalMove === 'down') handlers.onSwipeDown();
    }
  };

  target.addEventListener('touchstart', onTouchStart);
  target.addEventListener('touchend', onTouchEnd);

  return () => {
    target.removeEventListener('touchstart', onTouchStart);
    target.removeEventListener('touchend', onTouchEnd);
  };
};

type SwipeDetectorOptions = {
  isPreventDefault?: boolean;
};

export class SwipeDetector {
  private _target: HTMLElement;
  private _touchStartX = 0;
  private _touchStartY = 0;
  private _isPreventDefault = true;
  private _observers: ((direction: Direction) => void)[] = [];

  static of = (target: HTMLElement, options?: SwipeDetectorOptions) =>
    new SwipeDetector(target, options);

  constructor(target: HTMLElement, options?: SwipeDetectorOptions) {
    this._target = target;
    this._isPreventDefault = options?.isPreventDefault ?? this._isPreventDefault;
    this._target.addEventListener('touchstart', this._onTouchStart);
    this._target.addEventListener('touchend', this._onTouchEnd);
  }

  private _onTouchStart = (event: TouchEvent) => {
    if (this._isPreventDefault) event.preventDefault();
    const touch = event.touches[0];
    this._touchStartX = touch.clientX;
    this._touchStartY = touch.clientY;
  };

  private _onTouchEnd = (event: TouchEvent) => {
    if (this._isPreventDefault) event.preventDefault();

    const touch = event.changedTouches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;

    const deltaX = touchEndX - this._touchStartX;
    const deltaY = touchEndY - this._touchStartY;

    const direction = getSwipeDirection(deltaX, deltaY, MIN_SWIPE_DISTANCE);
    if (direction) this._observers.forEach((observer) => observer(direction));
  };

  observe = (onSwipe: (direction: Direction) => void): (() => void) => {
    this._observers.push(onSwipe);
    return () => {
      this._observers = this._observers.filter((o) => o !== onSwipe);
    };
  };

  dispose = () => {
    this._observers.length = 0;
    this._target.removeEventListener('touchstart', this._onTouchStart);
    this._target.removeEventListener('touchend', this._onTouchEnd);
  };
}
