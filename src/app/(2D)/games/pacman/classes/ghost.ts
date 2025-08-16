import random from 'lodash/random';

import { Direction } from '@/app/(2D)/games/pacman/utils/enum';
import { getRandomDirection } from '@/app/(2D)/games/pacman/utils/utils';

import { Player } from './player';
import { WallMap } from './wall-map';

const ghostImage = '/images/ghost.png';
const scaredGhostBlueImage = '/images/scaredGhost.png';
const scaredGhostWhiteImage = '/images/scaredGhost2.png';

const SCARED_TIME_BLUE = 4000;
const SCARED_TIME_WHITE = 2000;

const getRandomTimer = () => random(1000, 5000);

export class Ghost extends Player {
  private _isScared = false;
  private _isPaused = true;
  private _isVisible = true;
  private _normalGhost: HTMLImageElement | null = null;
  private _scaredGhostBlue: HTMLImageElement | null = null;
  private _scaredGhostWhite: HTMLImageElement | null = null;
  private _currentImage: HTMLImageElement | null = null;
  private _direction: Direction;
  private _nextDirection: Direction;
  private _scaredTimeBlue = 0;
  private _scaredTimeWhite = 0;
  private _directionChangeTimer = 0;

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
    this._scaredGhostBlue = new Image();
    this._scaredGhostBlue.src = scaredGhostBlueImage;
    this._scaredGhostWhite = new Image();
    this._scaredGhostWhite.src = scaredGhostWhiteImage;
    this._currentImage = this._normalGhost;
    this._direction = getRandomDirection();
    this._nextDirection = this._direction;
    this._directionChangeTimer = getRandomTimer();
  }

  get scared() {
    return this._isScared;
  }

  setScared() {
    this._isScared = true;
    this._currentImage = this._scaredGhostBlue;
    this._scaredTimeBlue = SCARED_TIME_BLUE;
  }

  private _resetDirectionChangeTimer = () => {
    this._directionChangeTimer = getRandomTimer();
    this._nextDirection = getRandomDirection();
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

  update = (deltaTime: number) => {
    if (this._isScared && this._scaredTimeBlue) {
      this._scaredTimeBlue -= deltaTime;
      if (this._scaredTimeBlue <= 0) {
        this._currentImage = this._scaredGhostWhite;
        this._scaredTimeBlue = 0;
        this._scaredTimeWhite = SCARED_TIME_WHITE;
      }
    }

    if (this._isScared && this._scaredTimeWhite) {
      this._scaredTimeWhite -= deltaTime;
      if (this._scaredTimeWhite <= 0) {
        this._scaredTimeWhite = 0;
        this._currentImage = this._normalGhost;
        this._isScared = false;
      }
    }

    this._directionChangeTimer -= deltaTime;
    if (this._directionChangeTimer <= 0) {
      this._resetDirectionChangeTimer();
    }

    if (!this._isPaused) this._move();
  };

  private _draw(context: CanvasRenderingContext2D) {
    if (!this._isVisible) return;
    if (!this._currentImage) return;
    context.drawImage(this._currentImage, this.x, this.y, this.size, this.size);
  }

  render = (context: CanvasRenderingContext2D) => {
    this._draw(context);
  };

  startMoving = () => {
    this._isPaused = false;
  };

  remove = () => {
    this._isVisible = false;
  };

  public dispose = () => {
    this.remove();
    this.wallMap = null!;
    this._normalGhost = null!;
    this._scaredGhostBlue = null!;
    this._scaredGhostWhite = null!;
    this._currentImage = null!;
  };
}
