export type FrameCallback = (time: number) => void;

export interface AnimationControllerOptions {
  maxFps?: number;
  immediate?: boolean;
}

export class AnimationController {
  private readonly _callback: FrameCallback;
  private readonly _minDt: number; // 0 when maxFps is 0 / Infinity
  private _id: number | null = null;
  private _last = 0;
  private _isRunning = false;

  constructor(
    frameCallback: FrameCallback,
    { maxFps = 0, immediate = true }: AnimationControllerOptions = {},
  ) {
    console.log({ immediate, maxFps });

    this._callback = frameCallback;
    this._minDt = maxFps ? 1000 / maxFps : 0;
    if (immediate) this.start();
  }

  private _tick = (now: number) => {
    if (!this._isRunning) return;
    if (!this._minDt || now - this._last >= this._minDt) {
      this._last = now;
      this._callback(now);
    }
    this._id = requestAnimationFrame(this._tick);
  };

  start = () => {
    if (this._isRunning) return;
    this._isRunning = true;
    this._last = performance.now();
    this._id = requestAnimationFrame(this._tick);
  };

  stop = () => {
    if (!this._isRunning) return;
    this._isRunning = false;
    if (this._id) cancelAnimationFrame(this._id);
    this._id = null;
  };
}
