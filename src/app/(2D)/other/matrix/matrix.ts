import { Symbol } from '@/app/(2D)/other/matrix/symbol';

export class Matrix {
  private _symbols: Symbol[] = [];

  public ghosting: number = 0.05;
  public fontSize: number = 24;
  public color: string = '#0affff'; // #ff097f

  populate = (width: number, height: number) => {
    const columns = Math.floor(width / this.fontSize);
    this._symbols = Array.from({ length: columns }, (_, i) => {
      const y = Math.random() * -height; // 0;
      return new Symbol(i, y, this.fontSize, height);
    });
    return this;
  };

  draw = (context: CanvasRenderingContext2D, width: number, height: number) => {
    context.fillStyle = `rgba(0, 0, 0, ${this.ghosting})`;
    context.fillRect(0, 0, width, height);
    context.textAlign = 'center';
    context.font = `${this.fontSize}px monospace`;
    context.fillStyle = this.color;

    this._symbols.forEach((symbol) => {
      symbol.draw(context);
      symbol.update();
    });
  };
}
