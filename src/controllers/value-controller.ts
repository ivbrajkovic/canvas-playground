import { clamp } from 'lodash/fp';

/**
 * Creates a value controller that manages a value within a specified range.
 * The value is clamped between the provided minimum and maximum values.
 *
 * @param initialValue - The initial value to set.
 * @param minValue - The minimum allowable value.
 * @param maxValue - The maximum allowable value.
 * @returns An object with getter and setter properties for `value`, `minValue`, and `maxValue`.
 *
 * @remarks
 * - The `value` property is clamped between `minValue` and `maxValue`.
 * - Setting `minValue` to a value greater than `maxValue` will log a warning and not change the value.
 * - Setting `maxValue` to a value less than `minValue` will log a warning and not change the value.
 */
export const createBoundedValue = (
  initialValue: number,
  minValue: number,
  maxValue: number,
) => {
  let value = clamp(initialValue, minValue, maxValue);

  return {
    get value() {
      return value;
    },
    set value(newValue: number) {
      value = clamp(newValue, minValue, maxValue);
    },
    get minValue() {
      return minValue;
    },
    set minValue(newMinValue: number) {
      if (newMinValue > maxValue) {
        console.warn('minValue cannot be greater than maxValue.');
        return;
      }
      minValue = newMinValue;
      value = clamp(value, minValue, maxValue);
    },
    get maxValue() {
      return maxValue;
    },
    set maxValue(newMaxValue: number) {
      if (newMaxValue < minValue) {
        console.warn('maxValue cannot be less than minValue.');
        return;
      }
      maxValue = newMaxValue;
      value = clamp(value, minValue, maxValue);
    },
  };
};
