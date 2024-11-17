type FrameCallback = (time: number) => void;
type AnimationControllerOptions = {
  frameCallback?: FrameCallback;
  immediate?: boolean;
  maxFps?: number;
};

export class AnimationController {
  private _frameCallback: FrameCallback | null;
  private _maxDeltaTimeMs: number | null; // 0.016 - Maximum delta time of ~16ms (60 FPS)
  private _requestId: number | null;
  private _lastTime = 0;
  private _isRunning = false;

  static of = (
    frameCallback: FrameCallback,
    options: Omit<AnimationControllerOptions, 'frameCallback'> = { immediate: true },
  ) => new AnimationController({ frameCallback, ...options });

  private constructor({
    frameCallback,
    immediate,
    maxFps,
  }: AnimationControllerOptions) {
    this._requestId = null;
    this._frameCallback = frameCallback ?? null;
    this._maxDeltaTimeMs = maxFps ? 1000 / maxFps : null;
    if (immediate && this._frameCallback) this.start();
  }

  get isRunning() {
    return this._isRunning;
  }

  set isRunning(value: boolean) {
    if (value) this.start();
    else this.stop();
  }

  set maxFps(value: string | number | null) {
    const newValue = Number.parseInt(value as string, 10);
    this._maxDeltaTimeMs = !Number.isNaN(newValue) ? 1000 / newValue : null;
  }

  set frameCallback(value: FrameCallback) {
    this._frameCallback = value;
  }

  get maxFps() {
    return this._maxDeltaTimeMs ? Math.round(1000 / this._maxDeltaTimeMs) : null;
  }

  private loop = (time: number) => {
    if (!this._isRunning || !this._frameCallback) return;

    if (this._maxDeltaTimeMs === null) {
      this._frameCallback(time);
    } else if (time - this._lastTime > this._maxDeltaTimeMs) {
      this._lastTime = time;
      this._frameCallback(time);
    }

    this._requestId = requestAnimationFrame(this.loop);
  };

  start = () => {
    this._isRunning = true;
    this._requestId = requestAnimationFrame(this.loop);
  };

  stop = () => {
    this._isRunning = false;
    if (!this._requestId) return;
    cancelAnimationFrame(this._requestId);
    this._requestId = null;
  };
}
