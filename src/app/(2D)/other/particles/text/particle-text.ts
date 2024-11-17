import { Particle } from '@/app/(2D)/other/particles/text/particle';
import { CanvasController } from '@/controllers/canvas-controller';

export class ParticleText {
  private _textCoordinates: ImageData | null = null;
  private _canvasController: CanvasController;
  private _lineWidth = 1;
  private _dpi = window.devicePixelRatio || 1;

  public particles: Particle[] = [];
  public text: string;
  public fontSize = 32;
  public positionOffset = 16;
  public isConnections = true;
  public linkingDistance = 28;
  public particleColor = '#ffffff';
  public lineColor = '#ffffff';

  static of = (canvasController: CanvasController, text: string) =>
    new ParticleText(canvasController, text);

  constructor(canvasController: CanvasController, text: string) {
    this._canvasController = canvasController;
    this.text = text;
  }

  private _initTextCoordinates = (context: CanvasRenderingContext2D) => {
    const font = this.fontSize / this._dpi;

    context.save();
    context.fillStyle = 'green';
    context.font = `${font}px Verdana`;
    context.fillText(this.text, 0, font);

    const textMarginBlock = 10 / this._dpi;
    const imageHeight = font + textMarginBlock;
    const textWidth = context.measureText(this.text).width;

    // Visualize scanning rect for debugging
    // context.strokeStyle = 'red';
    // context.strokeRect(0, 0, textWidth, imageHeight);

    this._textCoordinates = context.getImageData(
      0,
      0,
      textWidth * this._dpi,
      imageHeight * this._dpi,
    );
    context.restore();
  };

  private _populate = (width: number, height: number) => {
    if (!this._textCoordinates) return console.error('No text coordinates');

    this.particles.length = 0;

    const halfTextImageWidth = this._textCoordinates.width / 2;
    const halfTextImageHeight = this._textCoordinates.height / 2;
    const halfScreenWidth = width / 2;
    const halfScreenHeight = height / 2;
    const screenOffsetX = halfScreenWidth / this.positionOffset;
    const screenOffsetY = halfScreenHeight / this.positionOffset;

    for (let y = 0, y2 = this._textCoordinates.height; y < y2; y++) {
      for (let x = 0, x2 = this._textCoordinates.width; x < x2; x++) {
        if (
          // Every 4th element of array, maybe some optimization ?
          this._textCoordinates.data[
            y * 4 * this._textCoordinates.width + x * 4 + 3
          ] > 128
        ) {
          const positionX = x + screenOffsetX - halfTextImageWidth;
          const positionY = y + screenOffsetY - halfTextImageHeight;
          this.particles.push(
            new Particle(
              positionX * this.positionOffset,
              positionY * this.positionOffset,
              3,
            ),
          );
        }
      }
    }
  };

  private _drawLine = (
    context: CanvasRenderingContext2D,
    particle: Particle,
    index: number,
  ) => {
    let dx: number,
      dy: number,
      distanceSquared: number,
      connectionDistanceSquared: number,
      opacityValue: number;

    if (!this.isConnections) return;

    for (let j = index; j < this.particles.length; j++) {
      const otherParticle = this.particles[j];

      dx = particle.x - otherParticle.x;
      dy = particle.y - otherParticle.y;
      distanceSquared = dx * dx + dy * dy;
      connectionDistanceSquared = this.linkingDistance ** 2;

      if (distanceSquared > connectionDistanceSquared) continue;

      opacityValue = 1 - Math.pow(distanceSquared / connectionDistanceSquared, 0.5);
      context.save();
      context.strokeStyle = this.lineColor;
      context.lineWidth = this._lineWidth;
      context.globalAlpha = opacityValue;
      context.beginPath();
      context.moveTo(particle.x, particle.y);
      context.lineTo(otherParticle.x, otherParticle.y);
      context.stroke();
      context.restore();
    }
  };

  public init = () => {
    const { context, width, height } = this._canvasController;
    this._initTextCoordinates(context);
    this._populate(width, height);
  };

  drawScene = (
    context: CanvasRenderingContext2D,
    mouseX: number,
    mouseY: number,
    mouseRadius: number,
  ) => {
    this.particles.forEach((particle, index) => {
      particle.draw(context, this.particleColor);
      particle.update(mouseX, mouseY, mouseRadius);
      this._drawLine(context, particle, index);
    });
  };

  dispose = () => {
    this.particles = [];
    this._textCoordinates = null;
  };
}
