import { getLevelSpeedInMs } from '@/app/(2D)/games/tetris/level-speed';
import {
  createRandomTetromino,
  Direction,
  isTetrominoColliding,
  mergeTetrominoWithGrid,
  moveTetromino,
  rotateTetromino,
  Tetromino,
} from '@/app/(2D)/games/tetris/tetromino';
import { createGrid } from '@/utils/create-grid';

type Empty = 0;
type Filled = 1;

const empty: Empty = 0;
const filled: Filled = 1;

type Handlers = {
  onGameOver?: (score: number, bestScore: number) => void;
};

type Options = {
  cellSize: number;
  handlers?: Handlers;
};

export class Tetris {
  private _isPaused = true;
  private _isStarted = false;
  private _isGameOver = false;

  private _grid: number[][] = [];
  private _currentPiece!: Tetromino; // !Should be defined in the init method
  private _nextPiece: Tetromino | null = null;

  public gridFixedColor = 'gray';
  public gridEmptyColor = 'black';
  public gridBorderColor = 'white';
  public gridGuidesColor = '#ffffff30';
  public currentPieceColor = 'cyan';

  private _cellSize = 36;
  private _gridOffsetX = 0;
  private _gridOffsetY = 2;
  private _rows = 20;
  private _columns = 10;

  private _interval = 1000;
  private _timer: ReturnType<typeof setTimeout> | null = null;

  private _filledRowCount = 0;

  private _score = 0;
  private _bestScore = 0;
  private _level = 0;
  private _bestLevel = 0;
  private _maxLevel = 29;

  get isGameOver() {
    return this._isGameOver;
  }

  get isPaused() {
    return this._isPaused;
  }

  get isStarted() {
    return this._isStarted;
  }

  get score() {
    return this._score;
  }

  get bestScore() {
    return this._bestScore;
  }

  get level() {
    return this._level;
  }

  get bestLevel() {
    return this._bestLevel;
  }

  onGameOver?: (score: number, bestScore: number) => void;

  constructor({ cellSize, handlers }: Options) {
    this._cellSize = cellSize;
    this.onGameOver = handlers?.onGameOver;

    this.resetGameState();
  }

  public resetGameState = () => {
    this._isPaused = true;
    this._isGameOver = false;
    this._score = 0;
    this._level = 0;
    this._interval = getLevelSpeedInMs(0);
    this._grid = createGrid(this._columns, this._rows);
    this._loadBestScore();
    this._spawnTetromino();
  };

  public getGridSize = () => {
    const width = this._columns * this._cellSize;
    const height = this._rows * this._cellSize;
    const widthOffset = this._gridOffsetX * this._cellSize;
    const heightOffset = this._gridOffsetY * this._cellSize;
    return { width: width + widthOffset * 2, height: height + heightOffset };
  };

  private _loadBestScore = () => {
    const bestScore = localStorage.getItem('tetris-best-score');
    const bestLevel = localStorage.getItem('tetris-best-level');
    if (bestScore) this._bestScore = parseInt(bestScore, 10);
    if (bestLevel) this._bestLevel = parseInt(bestLevel, 10);
  };

  private _saveBestScore = () => {
    if (this._score > this._bestScore) {
      this._bestScore = this._score;
      localStorage.setItem('tetris-best-score', this._bestScore.toString());
      localStorage.setItem('tetris-best-level', this._level.toString());
    }
  };

  private _spawnTetromino = () => {
    const createPiece = () => {
      const newShape = createRandomTetromino(0, 0);
      // const newShape = createLineShape(0, 0);
      newShape.x = Math.floor(this._columns / 2 - newShape.shape[0].length / 2);
      return newShape;
    };
    this._currentPiece = this._nextPiece ?? createPiece();
    this._nextPiece = createPiece();
  };

  private _clearCompletedRows = () => {
    let rowsCleared = 0;
    for (let row = this._rows - 1; row >= 0; row--) {
      if (this._grid[row].every((cell) => cell === filled)) {
        this._grid.splice(row, 1);
        this._grid.unshift(new Array(this._columns).fill(empty));
        rowsCleared++;
      }
    }
    return rowsCleared;
  };

  private _getPointsPerCompletedRows = (filledRows: number) => {
    // 1 -> 40 *(level + 1)
    // 2 -> 100 * (level + 1)
    // 3 -> 300 * (level + 1)
    // 4 -> 1200 * (level + 1
    return [40, 100, 300, 1200][filledRows - 1] * (this._level + 1);
  };

  private _checkForCompletedRows = () => {
    const rowsCleared = this._clearCompletedRows();
    if (!rowsCleared) return;

    // Update score and filled row count
    this._score += this._getPointsPerCompletedRows(rowsCleared);
    this._filledRowCount += rowsCleared;

    // Increase level and speed every 10 filled rows
    if (this._filledRowCount % 10 === 0 && this._level < this._maxLevel) {
      this._level++;
      this._interval = getLevelSpeedInMs(this._level);
    }
  };

  private _addPieceToGrid = () => {
    this._grid = mergeTetrominoWithGrid(this._currentPiece, this._grid);
  };

  private _hasPiecesInTopLimit = () => {
    return this._grid[0].some((cell) => cell === filled);
  };

  // Game loop

  private _handleGameOver = () => {
    if (this._isGameOver) return;
    this._isGameOver = true;
    this._isPaused = true;
    this._saveBestScore();
    this.onGameOver?.(this._score, this._bestScore);
  };

  private _scheduleNextTick(): void {
    this._timer = setTimeout(this._onTick, this._interval);
  }

  private _onTick = () => {
    if (this._isPaused) return;

    const movedTetromino = this._moveTetromino('down');

    // If the piece can move down, update the current piece and schedule the next tick
    if (movedTetromino) {
      this._currentPiece = movedTetromino;
      this._scheduleNextTick();
      return;
    }

    // If the piece can't move down, it means it has collided with something
    this._addPieceToGrid();
    this._checkForCompletedRows();
    this._spawnTetromino();

    // If the grid has pieces in the top limit, the game is over
    if (this._hasPiecesInTopLimit()) {
      this._handleGameOver();
      return;
    }

    this._scheduleNextTick();
  };

  public resume = () => {
    if (!this._isPaused) return;
    this._isPaused = false;
    this._isStarted = true;
    this._scheduleNextTick();
  };

  public pause = () => {
    this._isPaused = true;
    if (this._timer) clearTimeout(this._timer);
  };

  // Drawing methods for the grid and pieces

  private _drawGridBorder = (context: CanvasRenderingContext2D) => {
    context.strokeStyle = 'white';
    context.lineWidth = 2;
    context.strokeRect(
      this._gridOffsetX * this._cellSize,
      this._gridOffsetY * this._cellSize,
      this._columns * this._cellSize,
      this._rows * this._cellSize,
    );
  };

  private _drawGuides = (context: CanvasRenderingContext2D) => {
    context.strokeStyle = '#ffffff30';
    context.lineWidth = 1;
    this._grid.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell === filled) return;
        context.strokeRect(
          columnIndex * this._cellSize + this._gridOffsetX * this._cellSize,
          rowIndex * this._cellSize + this._gridOffsetY * this._cellSize,
          this._cellSize,
          this._cellSize,
        );
      });
    });
  };

  private _drawBlock = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
  ) => {
    const normalizedX = x * this._cellSize + this._gridOffsetX * this._cellSize;
    const normalizedY = y * this._cellSize + this._gridOffsetY * this._cellSize;
    const normalizedSize = this._cellSize;

    context.fillStyle = color;
    context.fillRect(normalizedX, normalizedY, normalizedSize, normalizedSize);
    context.strokeStyle = 'black';
    context.strokeRect(normalizedX, normalizedY, normalizedSize, normalizedSize);
  };

  private _drawGrid = (context: CanvasRenderingContext2D) => {
    this._grid.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const color = cell === filled ? this.gridFixedColor : this.gridEmptyColor;
        this._drawBlock(context, columnIndex, rowIndex, color);
      });
    });
  };

  private _drawCurrentPiece = (context: CanvasRenderingContext2D) => {
    const { x, y, shape, color } = this._currentPiece;
    shape.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell === empty) return;
        this._drawBlock(
          context,
          x + columnIndex,
          y + rowIndex,
          color || this.currentPieceColor,
        );
      });
    });
  };

  private _drawLevelAndScore = (context: CanvasRenderingContext2D) => {
    const levelText = `Level: ${this._level}`;
    const scoreText = `Score: ${this._score}`;
    const bestScoreText = `Best: ${this._bestScore}`;

    const levelWidth = context.measureText(levelText).width;
    const scoreWidth = context.measureText(scoreText).width;
    const bestScoreWidth = context.measureText(bestScoreText).width;

    const x = this._columns * this._cellSize + this._gridOffsetX * this._cellSize;
    const y = this._gridOffsetY * this._cellSize;

    context.font = 'bold 16px Arial';
    context.fillStyle = 'white';
    context.fillText(levelText, x * 0.5 - levelWidth * 0.5, y - 20);
    context.fillText(scoreText, x - scoreWidth, y - 20);
    context.fillText(bestScoreText, x - bestScoreWidth, y - 40);
  };

  private _drawNextPiece = (context: CanvasRenderingContext2D) => {
    const nextPiece = this._nextPiece;
    if (!nextPiece) return;

    const positionX = this._gridOffsetX * this._cellSize;
    const positionY = this._gridOffsetY * this._cellSize - 40;
    const pieceSize = this._cellSize * 0.3;

    nextPiece.shape.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell === empty) return;

        context.fillRect(
          columnIndex * pieceSize + positionX,
          rowIndex * pieceSize + positionY,
          pieceSize,
          pieceSize,
        );
      });
    });
  };

  public renderGrid = (
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => {
    context.clearRect(0, 0, width, height);
    this._drawLevelAndScore(context);
    this._drawGrid(context);
    this._drawCurrentPiece(context);
    this._drawNextPiece(context);
    this._drawGuides(context);
    this._drawGridBorder(context);
  };

  // Movement methods

  private _moveTetromino = (direction: Direction) => {
    const movedTetromino = moveTetromino(this._currentPiece, direction);
    if (!isTetrominoColliding(movedTetromino, this._grid)) return movedTetromino;
    return null;
  };

  private _rotate = () => {
    const rotated = rotateTetromino(this._currentPiece);
    if (!isTetrominoColliding(rotated, this._grid)) return rotated;

    const shiftedLeft = moveTetromino(rotated, 'left');
    if (!isTetrominoColliding(shiftedLeft, this._grid)) return shiftedLeft;

    const shiftedRight = moveTetromino(rotated, 'right');
    if (!isTetrominoColliding(shiftedRight, this._grid)) return shiftedRight;

    return null;
  };

  public rotate = () => {
    const rotated = this._rotate();
    if (rotated) this._currentPiece = rotated;
  };

  public moveLeft = () => {
    const moved = this._moveTetromino('left');
    if (moved) this._currentPiece = moved;
  };

  public moveRight = () => {
    const moved = this._moveTetromino('right');
    if (moved) this._currentPiece = moved;
  };

  public moveDown = () => {
    const moved = this._moveTetromino('down');
    if (moved) this._currentPiece = moved;
  };

  public drop = () => {
    let dropCount = 0;
    let movedTetromino = null;
    while ((movedTetromino = this._moveTetromino('down'))) {
      this._currentPiece = movedTetromino;
      dropCount++;
    }
    this._score += dropCount;
  };

  // Cleanup method

  public dispose = () => {
    if (this._timer) clearTimeout(this._timer);
  };
}
