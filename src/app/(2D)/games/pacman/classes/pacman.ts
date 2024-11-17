import { Direction, MapObject } from '@/app/(2D)/games/pacman/utils/enum';

import { Player, Rect } from './player';
import { WallMap } from './wall-map';

const powerDot = '/sounds/power_dot.wav';
const waka = '/sounds/waka.wav';

enum Rotation {
  Right,
  Down,
  Left,
  Up,
}

const KILLED_TIMEOUT = 2000;
const RESETTING_COLOR_INTERVAL = 100;
const colors = ['yellow', 'transparent'];

export class Pacman extends Player {
  private _originalX: number;
  private _originalY: number;
  private _wallMap: WallMap;
  private _direction: Direction | null = null;
  private _nextDirection: Direction | null = null;
  private _rotation: Rotation = Rotation.Right;
  private _isOpeningMouth = false;
  private _mouthAngle = 0.8;
  private _wakaSound: HTMLAudioElement;
  private _powerDotSound: HTMLAudioElement;
  private _radius: number;
  private _color = colors[0];
  private _isResetting = false;
  private _isTeleporting = false;

  onStartMove?: () => void;
  onEatPellet?: () => void;
  onEatPowerPellet?: () => void;

  get isResetting() {
    return this._isResetting;
  }

  constructor(
    public x: number,
    public y: number,
    public rectSize: number,
    public velocity: number,
    wallMap: WallMap,
  ) {
    super(x, y, rectSize);
    this._originalX = x;
    this._originalY = y;
    this._wallMap = wallMap;
    this._wakaSound = new Audio(waka);
    this._powerDotSound = new Audio(powerDot);
    this._radius = this.rectSize / 2;
  }

  private _keyDownHandler = ({ key }: KeyboardEvent) => {
    if (this._direction === null) this.onStartMove?.();
    switch (key) {
      case 'ArrowUp':
        if (this._direction === Direction.Down) this._direction = Direction.Up;
        this._nextDirection = Direction.Up;
        break;

      case 'ArrowDown':
        if (this._direction === Direction.Up) this._direction = Direction.Down;
        this._nextDirection = Direction.Down;
        break;

      case 'ArrowLeft':
        if (this._direction === Direction.Right) this._direction = Direction.Left;
        this._nextDirection = Direction.Left;
        break;

      case 'ArrowRight':
        if (this._direction === Direction.Left) this._direction = Direction.Right;
        this._nextDirection = Direction.Right;
        break;
    }
  };

  private _updatePosition = () => {
    if (!this._isTeleporting && this._wallMap.isPortalAtPosition(this.x, this.y)) {
      const portal = this._wallMap.getPortalFromPosition(this.x, this.y)!;
      this.x = portal.outCoordinates.x;
      this.y = portal.outCoordinates.y;
      this._isTeleporting = true;
    }

    if (
      this._direction !== this._nextDirection &&
      Number.isInteger(this.x / this._wallMap.wallSize) &&
      Number.isInteger(this.y / this._wallMap.wallSize) &&
      !this._wallMap.isWallAtPosition(this.x, this.y, this._nextDirection)
    ) {
      this._direction = this._nextDirection;
    } else if (this._wallMap.isWallAtPosition(this.x, this.y, this._direction)) {
      return;
    }

    switch (this._direction) {
      case Direction.Up:
        this.y -= this.velocity;
        this._rotation = Rotation.Up;
        break;

      case Direction.Down:
        this.y += this.velocity;
        this._rotation = Rotation.Down;
        break;

      case Direction.Left:
        this.x -= this.velocity;
        this._rotation = Rotation.Left;
        break;

      case Direction.Right:
        this.x += this.velocity;
        this._rotation = Rotation.Right;
        break;
    }

    this._isTeleporting = false;
  };

  private _updateMouthMovement = () => {
    if (this._isOpeningMouth) this._mouthAngle += 0.05;
    else this._mouthAngle -= 0.05;
    this._isOpeningMouth =
      this._mouthAngle <= 0
        ? true
        : this._mouthAngle >= 0.8
          ? false
          : this._isOpeningMouth;
  };

  private _eatPellet = () => {
    const pellet = this._wallMap.eatPellet(this.x, this.y);
    if (pellet === undefined) return;
    if (pellet === MapObject.PowerPellet) {
      this._powerDotSound.play();
      this.onEatPowerPellet?.();
    }
    if (pellet === MapObject.Pellet) {
      this.onEatPellet?.();
      this._wakaSound.play();
    }
  };

  private _draw = (context: CanvasRenderingContext2D) => {
    context.save();
    context.translate(this.x + this._radius, this.y + this._radius);
    context.rotate((this._rotation * 90 * Math.PI) / 180);
    context.beginPath();
    context.arc(0, 0, this._radius, this._mouthAngle, Math.PI * 2 - this._mouthAngle);
    context.lineTo(0, 0);
    context.fillStyle = this._color;
    context.fill();
    context.restore();
  };

  public render = (context: CanvasRenderingContext2D) => {
    this._updatePosition();
    this._updateMouthMovement();
    this._eatPellet();
    this._draw(context);
  };

  public intersects = (rect: Rect) => {
    const x = this.x + this._radius;
    const y = this.y + this._radius;
    return (
      rect.x < x && rect.x + rect.width > x && rect.y < y && rect.y + rect.height > y
    );
  };

  public startKeyDownListener = () => {
    document.removeEventListener('keydown', this._keyDownHandler);
    document.addEventListener('keydown', this._keyDownHandler);
  };

  public removeKeyDownListener = () => {
    document.removeEventListener('keydown', this._keyDownHandler);
  };

  public reset = () => {
    this._isResetting = true;
    this.x = this._originalX;
    this.y = this._originalY;
    this._direction = null;
    this._nextDirection = null;

    const interval = setInterval(() => {
      this._color = colors[(colors.indexOf(this._color) + 1) % colors.length];
    }, RESETTING_COLOR_INTERVAL);

    setTimeout(() => {
      this._isResetting = false;
      clearInterval(interval);
      this._color = colors[0];
    }, KILLED_TIMEOUT);
  };

  public dispose = () => {
    this.removeKeyDownListener();
    this._wallMap = null!;
  };
}
