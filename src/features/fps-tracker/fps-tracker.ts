const createSpan = () => {
  const element = document.createElement('span');
  element.style.position = 'absolute';
  element.style.top = '0';
  element.style.backgroundColor = 'black';
  element.style.padding = '8px 16px';
  element.style.borderRadius = '4px';
  element.style.color = 'white';
  element.style.minWidth = '100px';
  return element;
};

export class FpsTracker {
  private targetEl: HTMLElement;
  private fps: number = 0;
  private frames: number = 0;
  private lastFrameTime: number = 0;

  constructor(
    targetEl: HTMLElement,
    private spanElement: HTMLSpanElement = createSpan(),
  ) {
    if (!targetEl) throw new Error('Element not found');
    this.targetEl = targetEl;
    this.targetEl.appendChild(spanElement);
  }

  track = () => {
    this.frames++;
    const now = performance.now();
    if (now - this.lastFrameTime < 1000) return;

    const delta = (now - this.lastFrameTime) * 0.001; // Time elapsed in seconds
    this.fps = this.frames / delta; // Average FPS over the elapsed time
    this.spanElement.textContent = `FPS: ${~~this.fps}`;
    this.frames = 0;
    this.lastFrameTime = now;
  };

  dispose = () => {
    this.spanElement?.remove();
  };
}