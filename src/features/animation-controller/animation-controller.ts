export class AnimationController {
  private _requestId: number | null = null;
  private _animation: FrameRequestCallback | null = null;
  private _isAnimating = false;

  onStart?: () => void;
  onStop?: () => void;

  get isAnimating() {
    return this._isAnimating;
  }

  set isAnimating(value: boolean) {
    this._isAnimating = value;
    this._toggle(value);
  }

  set animation(animation: FrameRequestCallback) {
    this._animation = animation;
  }

  private _toggle = (value: boolean) => {
    if (value) this.start();
    else this.stop();
  };

  private _tick = (time: number) => {
    if (this._animation === null) return console.error('No animation set');
    this._animation(time);
    this._requestId = requestAnimationFrame(this._tick);
  };

  start = (animation?: FrameRequestCallback) => {
    if (this._requestId !== null) return;
    if (animation) this._animation = animation;
    this._requestId = requestAnimationFrame(this._tick);
    this._isAnimating = true;
    this.onStart?.();
  };

  stop = () => {
    if (this._requestId === null) return;
    cancelAnimationFrame(this._requestId);
    this._requestId = null;
    this._isAnimating = false;
    this.onStop?.();
  };

  dispose = () => {
    this.stop();
    this._animation = null;
    this.onStart = undefined;
    this.onStop = undefined;
  };
}
