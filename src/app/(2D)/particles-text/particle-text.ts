import { Particle } from '@/app/(2D)/particles-text/particle';

const rangeMap = (a: number[], b: number[]) => (s: number) => {
  const [a1, a2] = a;
  const [b1, b2] = b;
  // Scaling up an order, and then down, to bypass a potential,
  // precision issue with negative numbers.
  return ((((b2 - b1) * (s - a1)) / (a2 - a1)) * 10 + 10 * b1) / 10;
};

export class ParticleText {
  static of = (canvas: HTMLCanvasElement, text: string) =>
    new ParticleText(canvas, text);

  private textCoordinates: ImageData;
  public text: string;

  private points: Point[] = [];
  private adjustX: number;
  private adjustY: number;
  private spreadX: number;
  private spreadY: number;
  private dpRatio = window.devicePixelRatio || 1;

  constructor(canvas: HTMLCanvasElement, text: string) {
    this.text = text;
    this.adjustX = 0;
    this.adjustY = 0;
    this.spreadX = 20;
    this.spreadY = 20;

    this.textCoordinates = new ImageData(0, 0);
  }

  initPosition = (width: number, height: number) => {
    const mappingX = width > height ? rangeMap([0, width], [0, 10])(width) : 0;
    const mappingY = rangeMap([0, height], [0, 0])(height);
    [this.adjustX, this.adjustY] = [mappingX, mappingY];
  };

  drawText = (context: CanvasRenderingContext2D, width: number, height: number) => {
    const font = rangeMap([0, width], [10, 30])(height);

    context.fillStyle = 'white';
    context.font = `${font}px Verdana`;
    context.fillText(this.text, 0, 30);

    // Visualize scanning rect for debugging
    context.strokeStyle = 'red';
    context.strokeRect(0, 0, font * 3, 50);

    this.textCoordinates = context.getImageData(0, 0, font * 3, 50);
  };

  populate = (width: number, height: number) => {
    this.points = [];

    const positionOffset = rangeMap([0, width], [5, 14 + 10 * this.dpRatio])(width);

    for (let y = 0, y2 = this.textCoordinates.height; y < y2; y++) {
      for (let x = 0, x2 = this.textCoordinates.width; x < x2; x++) {
        if (
          // Every 4th element of array, maybe some optimization ?
          this.textCoordinates.data[y * 4 * this.textCoordinates.width + x * 4 + 3] >
          128
        ) {
          const positionX = x + this.adjustX;
          const positionY = y + this.adjustY;
          this.points.push(
            new Particle(positionX * positionOffset, positionY * positionOffset, 3),
          );
        }
      }
    }
  };

  dispose = () => {};
}
