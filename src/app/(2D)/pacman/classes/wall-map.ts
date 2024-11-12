import { Direction, MapObject } from '@/app/(2D)/pacman/utils/enum';

import { Ghost } from './ghost';
import { Pacman } from './pacman';
import { Pellet } from './pellet';
import { PowerPellet } from './power-pellet';
import { Wall } from './wall';

export class WallMap {
  private _mapWidth = 0;
  private _mapHeight = 0;
  private _halfWallSize = 0;
  private _map: number[][] = [];
  private _mapArray: (Wall | Pellet)[] = [];

  public pelletCount = 0;
  public onEatAllPellets?: () => void;

  get width() {
    return this._mapWidth;
  }

  get height() {
    return this._mapHeight;
  }

  private playerPositions: {
    type: MapObject.Pacman | MapObject.Ghost;
    x: number;
    y: number;
  }[] = [];

  constructor(public wallSize: number) {
    this._halfWallSize = wallSize / 2;
  }

  isWall = (x: number, y: number, direction: Direction | null) => {
    if (
      direction === null ||
      !Number.isInteger(x / this.wallSize) ||
      !Number.isInteger(y / this.wallSize)
    )
      return false;

    let column = 0,
      row = 0,
      nextColumn = 0,
      nextRow = 0;

    switch (direction) {
      case Direction.Up:
        nextRow = y - this.wallSize;
        row = nextRow / this.wallSize;
        column = x / this.wallSize;
        break;

      case Direction.Down:
        nextRow = y + this.wallSize;
        row = nextRow / this.wallSize;
        column = x / this.wallSize;
        break;

      case Direction.Left:
        nextColumn = x - this.wallSize;
        column = nextColumn / this.wallSize;
        row = y / this.wallSize;
        break;

      case Direction.Right:
        nextColumn = x + this.wallSize;
        column = nextColumn / this.wallSize;
        row = y / this.wallSize;
        break;
    }

    return this._map[row][column] === 1;
  };

  public mapInit = (map: number[][]) => {
    this._map = map.map((row) => row.slice());
    this._mapArray = [];
    this.playerPositions = [];
    this._mapWidth = this.wallSize * map[0].length;
    this._mapHeight = this.wallSize * map.length;

    map.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        switch (column) {
          case MapObject.Pellet:
            this.pelletCount++;
            this._mapArray.push(
              new Pellet(
                this.wallSize * columnIndex + this._halfWallSize,
                this.wallSize * rowIndex + this._halfWallSize,
                this.wallSize / 10,
              ),
            );
            break;

          case MapObject.Wall:
            this._mapArray.push(
              new Wall(
                this.wallSize * columnIndex,
                this.wallSize * rowIndex,
                this.wallSize,
                this.wallSize,
              ),
            );
            break;

          case MapObject.Ghost:
            {
              // Add pellet under the ghost
              const isPowerPellet = Math.random() > 0.75;
              if (isPowerPellet) {
                this._map[rowIndex][columnIndex] = MapObject.PowerPellet;
                this._mapArray.push(
                  new PowerPellet(
                    this.wallSize * columnIndex + this._halfWallSize,
                    this.wallSize * rowIndex + this._halfWallSize,
                    this.wallSize / 10,
                  ),
                );
              } else {
                this.pelletCount++;
                this._map[rowIndex][columnIndex] = MapObject.Pellet;
                this._mapArray.push(
                  new Pellet(
                    this.wallSize * columnIndex + this._halfWallSize,
                    this.wallSize * rowIndex + this._halfWallSize,
                    this.wallSize / 10,
                  ),
                );
              }

              this.playerPositions.push({
                type: MapObject.Ghost,
                x: this.wallSize * columnIndex,
                y: this.wallSize * rowIndex,
              });
            }
            break;

          case MapObject.Pacman:
            this.playerPositions.push({
              type: MapObject.Pacman,
              x: this.wallSize * columnIndex,
              y: this.wallSize * rowIndex,
            });
            break;
        }
      });
    });
  };

  public draw = (context: CanvasRenderingContext2D) => {
    this._mapArray.forEach((item) => item.draw(context));
  };

  public getPacman = (velocity: number) => {
    const pacmanPosition = this.playerPositions.find(
      ({ type }) => type === MapObject.Pacman,
    );
    if (!pacmanPosition) throw new Error('Pacman not found');

    return new Pacman(
      pacmanPosition.x,
      pacmanPosition.y,
      this.wallSize,
      velocity,
      this,
    );
  };

  public getGhosts = (velocity: number) =>
    this.playerPositions
      .filter(({ type }) => type === MapObject.Ghost)
      .map(({ x, y }) => new Ghost(x, y, this.wallSize, velocity, 'red', this));

  public eatPellet = (x: number, y: number) => {
    const column = x / this.wallSize;
    const row = y / this.wallSize;

    if (!Number.isInteger(column) || !Number.isInteger(row)) return;
    if (
      this._map[row][column] !== MapObject.Pellet &&
      this._map[row][column] !== MapObject.PowerPellet
    )
      return;

    const pelletType = this._map[row][column] as
      | MapObject.Pellet
      | MapObject.PowerPellet;

    this._map[row][column] = MapObject.Empty;
    const dotX = x + this._halfWallSize;
    const dotY = y + this._halfWallSize;

    const pellet = this._mapArray.find(
      (item) => item.x === dotX && item.y === dotY,
    ) as Pellet | undefined;

    if (!pellet) return;

    pellet.isRender = false;
    if (pelletType === MapObject.Pellet) this.pelletCount--;
    if (this.pelletCount === 0) this.onEatAllPellets?.();

    return pelletType;
  };
}
