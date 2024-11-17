import { Direction } from '@/app/(2D)/games/pacman/utils/enum';
import { getRandomDirection } from '@/app/(2D)/games/pacman/utils/utils';
import random from 'lodash/random';

import { Player } from './player';
import { WallMap } from './wall-map';

const ghostImage = '/images/ghost.png';
const scaredGhostImage = '/images/scaredGhost.png';
const scaredGhostImage2 = '/images/scaredGhost2.png';

const SCARED_ACTIVE_TIME = 4000;
const SCARED_EXPIRE_TIME = SCARED_ACTIVE_TIME / 2;

const getRandomTimer = () => random(1000, 5000);

export class Ghost extends Player {
  private _isScared = false;
  private _isPaused = true;
  private _isVisible = true;
  private _normalGhost: HTMLImageElement | null = null;
  private _scaredGhost: HTMLImageElement | null = null;
  private _scaredGhost2: HTMLImageElement | null = null;
  private _currentImage: HTMLImageElement | null = null;
  private _direction: Direction;
  private _nextDirection: Direction;
  private _directionChangeTimer: ReturnType<typeof setTimeout>;
  private _timers: ReturnType<typeof setTimeout>[] = [];

  constructor(
    public x: number,
    public y: number,
    public size: number,
    public velocity: number,
    public color: string,
    public wallMap: WallMap,
  ) {
    super(x, y, size);
    this._normalGhost = new Image();
    this._normalGhost.src = ghostImage;
    this._scaredGhost = new Image();
    this._scaredGhost.src = scaredGhostImage;
    this._scaredGhost2 = new Image();
    this._scaredGhost2.src = scaredGhostImage2;
    this._currentImage = this._normalGhost;
    this._direction = getRandomDirection();
    this._nextDirection = this._direction;
    this._directionChangeTimer = this._resetDirectionChangeTimer();
  }

  get scared() {
    return this._isScared;
  }

  setScared() {
    this._isScared = true;
    this._currentImage = this._scaredGhost;
    this._timers.forEach((timer) => clearTimeout(timer));
    this._timers = [
      setTimeout(() => {
        this._isScared = false;
        this._currentImage = this._normalGhost;
      }, SCARED_ACTIVE_TIME),
      setTimeout(() => {
        this._currentImage = this._scaredGhost2;
      }, SCARED_EXPIRE_TIME),
    ];
  }

  private _resetDirectionChangeTimer = () => {
    clearTimeout(this._directionChangeTimer);
    const ms = getRandomTimer();
    return (this._directionChangeTimer = setTimeout(() => {
      this._nextDirection = getRandomDirection();
    }, ms));
  };

  private _move = () => {
    if (
      this._direction !== this._nextDirection &&
      Number.isInteger(this.x / this.wallMap.wallSize) &&
      Number.isInteger(this.y / this.wallMap.wallSize) &&
      !this.wallMap.isWallAtPosition(this.x, this.y, this._nextDirection)
    ) {
      this._direction = this._nextDirection;
    } else if (this.wallMap.isWallAtPosition(this.x, this.y, this._direction)) {
      this._nextDirection = getRandomDirection();
      this._resetDirectionChangeTimer();
      return;
    }

    switch (this._direction) {
      case Direction.Up:
        this.y -= this.velocity;
        break;
      case Direction.Down:
        this.y += this.velocity;
        break;
      case Direction.Left:
        this.x -= this.velocity;
        break;
      case Direction.Right:
        this.x += this.velocity;
        break;
    }
  };

  private _draw(context: CanvasRenderingContext2D) {
    if (!this._isVisible) return;
    if (!this._currentImage) return;
    context.drawImage(this._currentImage, this.x, this.y, this.size, this.size);
  }

  render = (context: CanvasRenderingContext2D) => {
    if (!this._isPaused) this._move();
    this._draw(context);
  };

  startMoving = () => {
    this._isPaused = false;
  };

  remove = () => {
    this._isVisible = false;
    this._timers.forEach((timer) => clearTimeout(timer));
  };

  public dispose = () => {
    this.remove();
    this.wallMap = null!;
    this._normalGhost = null!;
    this._scaredGhost = null!;
    this._scaredGhost2 = null!;
    this._currentImage = null!;
  };
}
