export class BoundedValue {
  private _value: number;
  private _min: number;
  private _max: number;

  static of = (value: number, min?: number, max?: number) =>
    new BoundedValue(value, min, max);

  constructor(value: number, min = value, max = value) {
    this._value = value;
    this._min = min;
    this._max = max;
  }

  get value() {
    return this._value;
  }
  set value(value: number) {
    this._value = Math.min(Math.max(value, this._min), this._max);
  }

  get min() {
    return this._min;
  }
  set min(value: number) {
    this._min = value;
  }

  get max() {
    return this._max;
  }
  set max(value: number) {
    this._max = value;
  }
}
