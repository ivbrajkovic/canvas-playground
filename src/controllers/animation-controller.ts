type FrameCallback = (time: number) => void;

export class AnimationController {
  private maxDeltaTimeMs: number | null = null; // 0.016 - Maximum delta time of ~16ms (60 FPS)
  private requestId: number | null = null;
  private lastTime = 0;

  static of = (
    callback: FrameCallback,
    options: { immediate?: boolean; maxFps?: number } = {},
  ) => new AnimationController(callback, options);

  private constructor(
    private callback: FrameCallback,
    {
      immediate = true,
      maxFps = null,
    }: { immediate?: boolean; maxFps?: number | null },
  ) {
    if (maxFps) this.maxDeltaTimeMs = 1000 / maxFps;
    if (immediate) this.start();
  }

  get isRunning() {
    return !!this.requestId;
  }

  set isRunning(value: boolean) {
    if (value) this.start();
    else this.stop();
  }

  set maxFps(value: string | number | null) {
    const newValue = Number.parseInt(value as string, 10);
    this.maxDeltaTimeMs = !Number.isNaN(newValue) ? 1000 / newValue : null;
  }

  get maxFps() {
    return this.maxDeltaTimeMs ? Math.round(1000 / this.maxDeltaTimeMs) : null;
  }

  private loop = (time: number) => {
    if (this.maxDeltaTimeMs === null) {
      this.callback(time);
    } else if (time - this.lastTime > this.maxDeltaTimeMs) {
      this.lastTime = time;
      this.callback(time);
    }
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
