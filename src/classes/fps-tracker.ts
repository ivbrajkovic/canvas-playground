import { createFpsTracker } from '@/utils/create-fps-tracker';

export class FpsTracker {
  private element: HTMLSpanElement;
  public static of = (targetEl: HTMLElement) => new FpsTracker(targetEl);

  private constructor(targetEl: HTMLElement) {
    const element = document.createElement('span');
    element.style.position = 'absolute';
    element.style.top = '0';
    element.style.backgroundColor = 'black';
    element.style.padding = '8px 16px';
    element.style.borderRadius = '4px';
    element.style.color = 'white';
    element.style.minWidth = '100px';
    element.innerText = 'FPS: 0';

    this.element = element;
    targetEl.appendChild(this.element);
  }

  private updateFps = (fps: number) => (this.element.textContent = `FPS: ${fps}`);

  public track = createFpsTracker(this.updateFps);

  public dispose = () => this.element.remove();
}
