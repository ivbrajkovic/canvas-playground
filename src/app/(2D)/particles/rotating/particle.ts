export class Particle {
  attack = 0;
  hold = 0;
  decay = 0;
  initValue = 0;
  holdValue = 0;
  lastValue = 0;
  stuckTime = 0;
  accelX = 0;
  accelY = 0;
  accelZ = 0;
  age = 0;
  dead = false;
  velX = 0;
  velY = 0;
  velZ = 0;
  x = 0;
  y = 0;
  z = 0;
  right = false;
  projX = 0;
  projY = 0;
  alpha = 0;

  next: Particle | null = null;
  prev: Particle | null = null;

  draw = (
    context: CanvasRenderingContext2D,
    rgbString: string,
    depthAlphaFactor: number,
    particleRad: number,
    m: number,
  ) => {
    context.fillStyle = rgbString + depthAlphaFactor * this.alpha + ')';
    context.beginPath();
    context.arc(this.projX, this.projY, m * particleRad, 0, 2 * Math.PI, false);
    context.closePath();
    context.fill();
  };
}
