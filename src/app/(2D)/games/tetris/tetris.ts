import { isBottomCollision, isCollision } from '@/app/(2D)/games/tetris/is-collision';
import { rotateClockwise } from '@/app/(2D)/games/tetris/rotate';
import {
  createMinusShape,
  createPlusShape,
  Tetromino,
} from '@/app/(2D)/games/tetris/tetromino';
import { createGrid } from '@/utils/create-grid';

type Empty = 0;
type Filled = 1;

const empty: Empty = 0;
const filled: Filled = 1;

const shapeCreators = [
  createPlusShape, //
  createMinusShape,
];

export class Tetris {
  private _grid: number[][] = [];
  private _cellSize = 50;
  private _rows = 20;
  private _columns = 10;
  private _interval = 1000;
  private _timer: ReturnType<typeof setTimeout> | null = null;

  private _currentPiece: Tetromino;

  constructor() {
    this._grid = createGrid(this._columns, this._rows);
    this._currentPiece = createMinusShape(this._columns / 2 - 1, 0);
    this._timer = setTimeout(this._onTick, this._interval);
  }

  private _clearGrid = () => {};

  private _checkRows = () => {};

  private _removeRow = () => {};

  private _createRandomPiece = () => {
    const shapeCreator =
      shapeCreators[Math.floor(Math.random() * shapeCreators.length)];
    const newShape = shapeCreator(0, 0);
    newShape.x = Math.floor(this._columns / 2 - newShape.shape[0].length / 2);
    this._currentPiece = newShape;
  };

  private _onTick = () => {
    if (isBottomCollision(this._currentPiece, this._grid)) {
      this._addPieceToGrid();
      this._createRandomPiece();
    } else {
      this.moveDown();
    }
    this._timer = setTimeout(this._onTick, this._interval);
  };

  private _drawGridBorder = (context: CanvasRenderingContext2D) => {
    context.strokeStyle = 'white';
    context.lineWidth = 1;
    context.strokeRect(
      0,
      0,
      this._columns * this._cellSize,
      this._rows * this._cellSize,
    );
  };

  private _drawGuides = (context: CanvasRenderingContext2D) => {
    context.strokeStyle = '#ffffff30';
    context.lineWidth = 1;
    this._grid.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        context.strokeRect(
          columnIndex * this._cellSize,
          rowIndex * this._cellSize,
          this._cellSize,
          this._cellSize,
        );
      });
    });
  };

  private _drawGrid = (context: CanvasRenderingContext2D) => {
    this._grid.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        context.fillStyle = cell ? 'white' : 'black';
        context.fillRect(
          columnIndex * this._cellSize,
          rowIndex * this._cellSize,
          this._cellSize,
          this._cellSize,
        );
      });
    });
  };

  private _drawPiece = (context: CanvasRenderingContext2D) => {
    this._currentPiece.shape.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell) {
          context.fillStyle = 'white';
          context.fillRect(
            (columnIndex + this._currentPiece.x) * this._cellSize,
            (rowIndex + this._currentPiece.y) * this._cellSize,
            this._cellSize,
            this._cellSize,
          );
        }
      });
    });
  };

  private _addPieceToGrid = () => {
    const { shape, x, y } = this._currentPiece;
    shape.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell === filled) this._grid[y + rowIndex][x + columnIndex] = filled;
      });
    });
  };

  private _isOutsideGrid = (x: number, y: number) => {
    return x < 0 || x >= this._columns || y < 0 || y >= this._rows;
  };

  private _isOccupied = (x: number, y: number) => {
    return this._grid[y][x] === filled;
  };

  private _movePiece = (x: number, y: number) => {
    const nextX = this._currentPiece.x + x;
    const nextY = this._currentPiece.y + y;
    const newPiece = { ...this._currentPiece, x: nextX, y: nextY };

    if (isCollision(newPiece, this._grid)) return;

    this._currentPiece = newPiece;
  };

  public moveLeft = () => {
    this._movePiece(-1, 0);
  };

  public moveRight = () => {
    this._movePiece(1, 0);
  };

  public moveDown = () => {
    this._movePiece(0, 1);
  };

  public moveUp = () => {
    this._movePiece(0, -1);
  };

  public rotate = () => {
    const rotated = rotateClockwise(this._currentPiece, this._grid);
    this._currentPiece = rotated;
  };

  draw = (context: CanvasRenderingContext2D, width: number, height: number) => {
    context.clearRect(0, 0, width, height);
    this._drawGrid(context);
    this._drawPiece(context);
    this._drawGuides(context);
  };

  dispose = () => {
    if (this._timer) clearTimeout(this._timer);
  };
}
