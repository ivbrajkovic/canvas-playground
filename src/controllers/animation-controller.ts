export class AnimationController {
  #requestId: number | null = null;
  #animation: FrameRequestCallback | null = null;

  #tick = (time: number) => {
    if (this.#animation === null) return;
    this.#animation(time);
    this.#requestId = requestAnimationFrame(this.#tick);
  };

  setAnimation = (animation: FrameRequestCallback) => {
    this.#animation = animation;
  };

  start = (animation: FrameRequestCallback) => {
    this.setAnimation(animation);
    this.resume();
  };

  stop = () => {
    if (this.#requestId === null) return;
    cancelAnimationFrame(this.#requestId);
    this.#requestId = null;
  };

  resume = () => {
    if (this.#requestId !== null) return;
    this.#requestId = requestAnimationFrame(this.#tick);
  };

  toggle = (value: boolean) => {
    if (value) this.resume();
    else this.stop();
  };
}
