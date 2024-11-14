export class ParticlesText {
  static of = (canvas: HTMLCanvasElement, text: string) =>
    new ParticlesText(canvas, text);

  constructor(canvas: HTMLCanvasElement, text: string) {}

  animate = (context: CanvasRenderingContext2D) => {};

  dispose = () => {};
}
