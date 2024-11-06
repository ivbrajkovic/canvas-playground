type FrameCallback = (time: number) => void;

export class AnimationController {
  private requestId: number | null = null;

  static of = (callback: FrameCallback, immediate?: boolean) =>
    new AnimationController(callback, immediate);

  private constructor(private callback: FrameCallback, immediate = true) {
    if (immediate) this.start();
  }

  get isRunning() {
    return !!this.requestId;
  }

  set isRunning(value: boolean) {
    if (value) this.start();
    else this.stop();
  }

  private loop = (time: number) => {
    this.callback(time);
    this.requestId = requestAnimationFrame(this.loop);
  };

  start = () => {
    if (this.requestId) return;
    this.requestId = requestAnimationFrame(this.loop);
  };

  stop = () => {
    if (!this.requestId) return;
    cancelAnimationFrame(this.requestId);
    this.requestId = null;
  };
}
