export class AnimationFrame {
  private requestId = 0;

  constructor(private callback: FrameRequestCallback) {}

  start = (time = 0) => {
    this.callback(time);
    this.requestId = requestAnimationFrame(this.start);
  };

  stop = () => {
    cancelAnimationFrame(this.requestId);
  };
}
