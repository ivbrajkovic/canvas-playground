const portalImage = '/images/portal.png';

export class Portal {
  private _portalImage: HTMLImageElement;

  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public outCoordinates: { x: number; y: number },
  ) {
    this._portalImage = new Image();
    this._portalImage.src = portalImage;
  }

  draw(context: CanvasRenderingContext2D) {
    context.drawImage(this._portalImage, this.x, this.y, this.width, this.height);
  }
}
