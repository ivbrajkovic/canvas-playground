export class FpsTracker {
  #fps: number = 0;
  #frames: number = 0;
  #lastFrameTime: number = 0;
  #element: HTMLElement | null = null;

  init = (elementId = 'canvas') => {
    const element = document.getElementById(elementId)?.parentElement;
    if (!element) throw new Error('Element not found');
    const span = document.createElement('span');
    span.style.position = 'absolute';
    span.style.top = '0';
    span.style.backgroundColor = 'black';
    span.style.padding = '8px 16px';
    span.style.borderRadius = '4px';
    span.style.color = 'white';
    span.style.minWidth = '120px';
    element.appendChild(span);
    this.#element = span;
  };

  track = () => {
    if (!this.#element) return console.error('Element not found');

    this.#frames++;
    const now = performance.now();
    if (now - this.#lastFrameTime < 1000) return;

    const delta = (now - this.#lastFrameTime) * 0.001; // Time elapsed in seconds
    this.#fps = this.#frames / delta; // Average FPS over the elapsed time
    this.#element.textContent = `FPS: ${this.#fps.toFixed(2)}`;
    this.#frames = 0;
    this.#lastFrameTime = now;
  };

  dispose = () => {
    this.#element?.remove();
  };
}
