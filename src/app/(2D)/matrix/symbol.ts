const characters =
  'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const getRandomCharacter = () =>
  characters.charAt(~~(Math.random() * characters.length));

const shouldResetPosition = () => Math.random() > 0.975;

export class Symbol {
  constructor(
    public x: number,
    private y: number,
    private fontSize: number,
    private canvasHeight: number,
    private xOffset = x * fontSize,
  ) {}

  draw(context: CanvasRenderingContext2D) {
    const char = getRandomCharacter();
    context.fillText(char, this.xOffset, this.y);
  }

  update() {
    if (this.y > this.canvasHeight && shouldResetPosition()) this.y = 0;
    else this.y += this.fontSize;
  }
}
