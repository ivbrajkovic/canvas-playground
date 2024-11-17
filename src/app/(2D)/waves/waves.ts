type Size = { width: number; height: number };

export class Waves {
  private _size: Size;

  public isAnimateColor = true;
  public isAnimateAmplitude = true;
  public amplitude = 100;
  public waveLength = 0.01;
  public frequency = 0.01;
  public hue = 255;
  public saturation = 50;
  public lightness = 50;
  public ghosting = 0.06;
  public y: number;

  private increment = this.frequency;

  public static of = (size: Size, y?: number) => new Waves(size, y);
  constructor(size: Size, y = size.height / 2) {
    this._size = size;
    this.y = y;
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = `hsla(0, 0%, 10%, ${this.ghosting})`;
    context.fillRect(0, 0, this._size.width, this._size.height);

    const hue = this.isAnimateColor
      ? Math.abs(this.hue * Math.sin(this.increment))
      : this.hue;

    context.strokeStyle = `hsl(${hue}, ${this.saturation}%, ${this.lightness}%)`;
    context.beginPath();
    context.moveTo(0, this.y);

    for (let x = 0; x < context.canvas.width; x++) {
      const amplitude = this.isAnimateAmplitude
        ? this.amplitude * Math.sin(this.increment)
        : this.amplitude;

      const waveLength = Math.sin(x * this.waveLength + this.increment);
      context.lineTo(x, this.y + waveLength * amplitude);
    }

    context.stroke();
    context.closePath();

    this.increment += this.frequency;
  }
}
