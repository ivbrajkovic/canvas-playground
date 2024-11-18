import {
  createRandomShape,
  createVerticalLineShape,
  Direction,
  isTetrominoBottomColliding,
  isTetrominoColliding,
  isTetrominoOutOfBounds,
  moveTetromino,
  rotateTetromino,
  Tetromino,
} from '@/app/(2D)/games/tetris/tetromino';
import { createGrid } from '@/utils/create-grid';

type Empty = 0;
type Filled = 1;

const empty: Empty = 0;
const filled: Filled = 1;

export class Tetris {
  private _grid: number[][] = [];
  private _currentPiece!: Tetromino; // Current piece being controlled, will be defined in the init method
  private _nextPiece: Tetromino | null = null;

  private _scorePerRow = 100;
  private _bonusPerRow = 10;
  private _cellSize = 50;
  private _gridOffsetX = 4;
  private _gridOffsetY = 4;
  private _rows = 13;
  private _columns = 10;
  private _interval = 1000;
  private _hiddenRows = 3; // Rows hidden from the top
  private _topLimitIndex = this._hiddenRows - 1;
  private _timer: ReturnType<typeof setTimeout> | null = null;

  public score = 0;

  onGameOver?: () => void;

  constructor() {
    this.init();
  }

  private _generateRandomTetromino = () => {
    const createPiece = () => {
      const newShape = createVerticalLineShape(0, 0);
      newShape.x = Math.floor(this._columns / 2 - newShape.shape[0].length / 2);
      newShape.y = Math.floor(this._hiddenRows - newShape.shape.length);
      return newShape;
    };
    this._currentPiece = this._nextPiece ?? createPiece();
    this._nextPiece = createPiece();
  };

  private _clearGrid = () => {
    this._grid = createGrid(this._columns, this._rows);
  };

  private _checkRows = () => {
    let removedRows = 0;

    this._grid.forEach((row, rowIndex) => {
      if (row.every((cell) => cell === filled)) {
        this._removeRow(rowIndex);
        removedRows++;
      }
    });

    // Add points for cleared rows
    if (removedRows) this.score += removedRows * this._scorePerRow;

    // Add bonus points for multiple rows cleared
    if (removedRows > 1) {
      const bonus = this._bonusPerRow * Math.pow(2, removedRows - 1);
      this.score += bonus;
    }
  };

  private _removeRow = (index: number) => {
    this._grid.splice(index, 1);
    this._grid.unshift(new Array(this._columns).fill(empty));
  };

  private _addPieceToGrid = () => {
    const { shape, x, y } = this._currentPiece;
    shape.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell === filled) this._grid[y + rowIndex][x + columnIndex] = filled;
      });
    });
  };

  private _hasPiecesInTopLimit = () => {
    return this._grid[this._topLimitIndex].some((cell) => cell === filled);
  };

  // Game loop

  private _onTick = () => {
    if (isTetrominoBottomColliding(this._currentPiece, this._grid)) {
      this._addPieceToGrid();
      this._generateRandomTetromino();

      if (this._hasPiecesInTopLimit()) {
        this.onGameOver?.();
        return;
      }
    }

    // this.moveDown();
    this._checkRows();
    this._timer = setTimeout(this._onTick, this._interval);
  };

  // Drawing methods for the grid and pieces

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
      if (rowIndex < this._hiddenRows) return; // Skip drawing the top rows

      row.forEach((cell, columnIndex) => {
        context.strokeRect(
          columnIndex * this._cellSize + this._gridOffsetX * this._cellSize,
          rowIndex * this._cellSize + this._gridOffsetY * this._cellSize,
          this._cellSize,
          this._cellSize,
        );
      });
    });
  };

  private _drawGrid = (context: CanvasRenderingContext2D) => {
    this._grid.forEach((row, rowIndex) => {
      if (rowIndex < this._hiddenRows) return; // Skip drawing the top rows

      row.forEach((cell, columnIndex) => {
        context.fillStyle = cell ? 'white' : 'black';
        context.fillRect(
          columnIndex * this._cellSize + this._gridOffsetX * this._cellSize,
          rowIndex * this._cellSize + this._gridOffsetY * this._cellSize,
          this._cellSize,
          this._cellSize,
        );
      });
    });
  };

  private _drawCurrentPiece = (context: CanvasRenderingContext2D) => {
    this._currentPiece.shape.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell === empty) return;

        const x = columnIndex + this._currentPiece.x;
        const y = rowIndex + this._currentPiece.y;

        context.fillStyle = y < this._hiddenRows ? '#FFFFFF40' : 'white';
        context.fillRect(
          x * this._cellSize + this._gridOffsetX * this._cellSize,
          y * this._cellSize + this._gridOffsetY * this._cellSize,
          this._cellSize,
          this._cellSize,
        );
      });
    });
  };

  private _drawNextPiece = (context: CanvasRenderingContext2D) => {
    const nextPiece = this._nextPiece;
    if (!nextPiece) return;

    const positionX = this._gridOffsetX * this._cellSize;
    const positionY = this._gridOffsetY * this._cellSize;
    const pieceSize = this._cellSize * 0.3;

    context.font = 'bold 16px Arial';
    context.fillStyle = 'white';

    context.fillText('Score:', positionX, positionY);
    context.fillText(this.score.toString(), positionX + 60, positionY);
    context.fillText('Next:', positionX, positionY + 30);

    nextPiece.shape.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell === empty) return;

        context.fillRect(
          columnIndex * pieceSize + positionX,
          rowIndex * pieceSize + positionY + 50,
          pieceSize,
          pieceSize,
        );
      });
    });
  };

  public draw = (
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => {
    context.clearRect(0, 0, width, height);
    this._drawGrid(context);
    this._drawCurrentPiece(context);
    this._drawNextPiece(context);
    this._drawGuides(context);
  };

  // Move methods for the current piece

  private _moveTetromino = (direction: Direction) => {
    const newPiece = moveTetromino(this._currentPiece, direction);

    if (
      isTetrominoOutOfBounds(newPiece, this._grid) ||
      isTetrominoColliding(newPiece, this._grid)
    )
      return;

    this._currentPiece = newPiece;
  };

  public moveLeft = () => {
    this._moveTetromino('left');
  };

  public moveRight = () => {
    this._moveTetromino('right');
  };

  public moveDown = () => {
    this._moveTetromino('down');
  };

  public moveUp = () => {
    this._moveTetromino('up');
  };

  public rotate = () => {
    const rotated = rotateTetromino(this._currentPiece);
    if (
      isTetrominoOutOfBounds(rotated, this._grid) ||
      isTetrominoColliding(rotated, this._grid)
    )
      return;

    this._currentPiece = rotated;
  };

  public init = () => {
    this._clearGrid();
    this._generateRandomTetromino();
    this._timer = setTimeout(this._onTick, this._interval);
  };

  // Cleanup method

  public dispose = () => {
    if (this._timer) clearTimeout(this._timer);
  };
}
