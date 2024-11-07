import { normalizeExponential } from '@/utils/normalize-exponential';

export const createTrailValue = (value: number) => ({
  get value() {
    return value;
  },
  set value(newValue: number) {
    value = newValue;
  },
  get normalizedValue() {
    return 1 - normalizeExponential(value, 5);
  },
  set normalizedValue(newValue: number) {
    value = 1 - normalizeExponential(newValue, 5);
  },
  setup() {},
});
