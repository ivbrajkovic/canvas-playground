import { Symbol } from '@/app/(2D)/matrix/symbol';

type Size = { width: number; height: number };

export class Matrix {
  private _size: Size;
  private _symbols: Symbol[] = [];

  public ghosting: number = 0.05;
  public fontSize: number = 24;

  static of = (size: Size) => new Matrix(size);

  constructor(size: { width: number; height: number }) {
    this._size = size;
  }

  populate = () => {
    const { width, height } = this._size;
    const columns = Math.floor(width / this.fontSize);

    this._symbols = Array.from({ length: columns }, (_, i) => {
      const y = Math.random() * -height;
      return new Symbol(i, y, this.fontSize, height);
      // return new Symbol(i, 0, this.fontSize, height);
    });
  };

  draw = (context: CanvasRenderingContext2D) => {
    context.fillStyle = `rgba(0, 0, 0, ${this.ghosting})`;
    context.fillRect(0, 0, this._size.width, this._size.height);
    context.textAlign = 'center';
    context.font = `${this.fontSize}px monospace`;
    // context.fillStyle = "#0aff0a";
    context.fillStyle = '#0affff';

    this._symbols.forEach((symbol) => {
      symbol.draw(context);
      symbol.update();
    });
  };

  dispose = () => {};
}
