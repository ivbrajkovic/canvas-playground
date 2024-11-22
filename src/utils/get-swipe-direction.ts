export type SwipeDirection = 'horizontal' | 'vertical';
export type HorizontalMove = 'left' | 'right';
export type VerticalMove = 'up' | 'down';
export type Direction = 'left' | 'right' | 'up' | 'down';

// Detect if swipe was horizontal or vertical
export const swipeDir = (deltaX: number, deltaY: number): SwipeDirection => {
  return Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
};

// Detect if swipe was left or right
export const swipeLeftOrRight = (
  x: number,
  threshold: number,
): HorizontalMove | null => {
  return x > threshold ? 'right' : x < -threshold ? 'left' : null;
};

// Detect if swipe was up or down
export const swipeUpOrDown = (y: number, threshold: number): VerticalMove | null => {
  return y > threshold ? 'down' : y < -threshold ? 'up' : null;
};

// Get the direction of the swipe
export const getSwipeDirection = (
  deltaX: number,
  deltaY: number,
  threshold: number,
): Direction | null => {
  const direction = swipeDir(deltaX, deltaY);
  if (direction === 'horizontal') return swipeLeftOrRight(deltaX, threshold);
  if (direction === 'vertical') return swipeUpOrDown(deltaY, threshold);
  return null;
};
