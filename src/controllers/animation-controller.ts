export class AnimationController {
  #requestId: number | null = null;
  #animation: FrameRequestCallback | null = null;

  #tick = (time: number) => {
    this.#animation!(time); // We know this is not null
    this.#requestId = requestAnimationFrame(this.#tick);
  };

  setAnimation = (animation: FrameRequestCallback) => {
    this.#animation = animation;
  };

  start = (animation: FrameRequestCallback) => {
    this.setAnimation(animation);
    if (this.#requestId === null)
      this.#requestId = requestAnimationFrame(this.#tick);
    return this.dispose;
  };

  dispose = () => {
    if (this.#requestId === null) return;
    cancelAnimationFrame(this.#requestId);
    this.#requestId = null;
  };
}
