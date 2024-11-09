export class Waves {
  public isAnimateColor = true;
  public isAnimateAmplitude = true;
  public amplitude = 100;
  public waveLength = 0.01;
  public frequency = 0.01;
  public hue = 255;
  public saturation = 50;
  public lightness = 50;

  private increment = this.frequency;

  public static of = (y: number) => new Waves(y);
  constructor(public y: number) {}

  draw(context: CanvasRenderingContext2D) {
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
