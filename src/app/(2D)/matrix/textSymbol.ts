const shouldResetPosition = () => Math.random() > 0.975;

export class TextSymbol {
  private currentIndex: number = 0;

  constructor(
    public text: string,
    public x: number,
    private y: number,
    private fontSize: number,
    private canvasHeight: number,
  ) {}

  draw(context: CanvasRenderingContext2D) {
    const char = this.text.charAt(this.currentIndex);
    context.fillText(char, this.x, this.y);
  }

  update() {
    this.currentIndex++;
    if (this.currentIndex >= this.text.length) {
      this.currentIndex = 0; // Reset to the beginning of the text
    }
    this.y += this.fontSize;
    if (this.y > this.canvasHeight && shouldResetPosition()) {
      this.y = 0; // Reset to the top of the canvas
    }
  }
}
