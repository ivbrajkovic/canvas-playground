import { Ghost } from './ghost';
import { Pacman } from './pacman';
import { WallMap } from './wall-map';

const eatGhostSound = '/sounds/eat_ghost.wav';
const gameOverSound = '/sounds/gameOver.wav';
const gameWinSound = '/sounds/gameWin.wav';

type GameProps = {
  wallSize: number;
  velocity: number;
  map: number[][][];
  score: number;
  level: number;
  pacmanLife: number;
  handlers?: {
    onGameWin?: () => void;
    onGameOver?: () => void;
    onGameReset?: () => void;
    onPacmanLifeChange?: (life: number) => void;
    onScoreChange?: (score: number) => void;
    onLevelChange?: (level: number) => void;
    onMapChange?: (mapWidth: number, mapHeight: number) => void;
  };
};

export class Game {
  private _isGameOver = false;
  private _isGameWin = false;
  private _currentLevel: number;
  private _wallMap: WallMap;
  private _score: number;
  private _pacman!: Pacman;
  private _pacmanLife: number;
  private _originalPacmanLife: number;
  private _ghosts: Ghost[] = [];
  private _velocity: number;
  private _maps: number[][][];
  private _gameOverSound: HTMLAudioElement;
  private _gameWinSound: HTMLAudioElement;
  private _eatGhostSound: HTMLAudioElement;

  public onGameOver?: () => void;
  public onPacmanLifeChange?: (life: number) => void;
  public onScoreChange?: (score: number) => void;
  public onLevelChange?: (level: number) => void;
  public onGameWin?: () => void;
  public onGameReset?: () => void;
  public onMapChange?: (mapWidth: number, mapHeight: number) => void;
  public onEatGhost?: () => void;

  get pacman() {
    return this._pacman;
  }

  get isGameOver() {
    return this._isGameOver;
  }

  get IsGameWin() {
    return this._isGameWin;
  }

  get width() {
    return this._wallMap.width;
  }

  get height() {
    return this._wallMap.height;
  }

  constructor({
    wallSize: rectSize,
    velocity,
    map,
    score,
    level,
    pacmanLife,
    handlers,
  }: GameProps) {
    this._maps = map;
    this._score = score;
    this._currentLevel = level;
    this._velocity = velocity;
    this._pacmanLife = pacmanLife;
    this._originalPacmanLife = pacmanLife;
    this._wallMap = new WallMap(rectSize);
    this._gameWinSound = new Audio(gameWinSound);
    this._gameOverSound = new Audio(gameOverSound);
    this._eatGhostSound = new Audio(eatGhostSound);

    this.onGameOver = handlers?.onGameOver;
    this.onPacmanLifeChange = handlers?.onPacmanLifeChange;
    this.onScoreChange = handlers?.onScoreChange;
    this.onLevelChange = handlers?.onLevelChange;
    this.onGameWin = handlers?.onGameWin;
    this.onMapChange = handlers?.onMapChange;
    this.onGameReset = handlers?.onGameReset;

    this.initGame();
  }

  private _initMap() {
    this._wallMap.mapInit(this._maps[this._currentLevel]);
    this._wallMap.onEatAllPellets = this._onEatAllPellets;
    this.onMapChange?.(this._wallMap.width, this._wallMap.height);
  }

  private _changeScore = (value: number) => {
    this._score += value;
    this.onScoreChange?.(this._score);
  };

  private _initPlayers() {
    this._pacman = this._wallMap.getPacman(this._velocity);
    this._ghosts = this._wallMap.getGhosts(this._velocity);
    this._pacman.onStartMove = () => this._ghosts.forEach((g) => g.startMoving());
    this._pacman.onEatPowerPellet = () => this._ghosts.forEach((g) => g.setScared());
    this._pacman.onEatPellet = () => this._changeScore(1);
  }

  private _eatPacman() {
    if (this._pacman.isResetting) return;

    this._pacmanLife--;
    this.onPacmanLifeChange?.(this._pacmanLife);

    if (this._pacmanLife > 0) {
      this._pacman.reset();
    } else {
      this._isGameOver = true;
      this._gameOverSound.play().catch(() => {});
      this.onGameOver?.();
    }
  }

  private _eatGhost(ghostIndex: number) {
    this._ghosts[ghostIndex].remove();
    this._ghosts.splice(ghostIndex, 1);
    this._eatGhostSound.play().catch(() => {});
    this._changeScore(10);
  }

  private _pacmanGhostCollision() {
    this._ghosts.forEach((ghost, ghostIndex) => {
      if (!this._pacman.intersects(ghost.getRect())) return;
      ghost.scared ? this._eatGhost(ghostIndex) : this._eatPacman();
    });
  }

  private _onEatAllPellets = () => {
    const isLastLevel = this._currentLevel === this._maps.length - 1;
    if (isLastLevel) {
      this._isGameWin = true;
      this._gameWinSound.play().catch(() => {});
      this.onGameWin?.();
    } else {
      this.nextLevel();
    }
  };

  public update = (deltaTime: number) => {
    this._pacman.update(deltaTime);
    this._ghosts.forEach((ghost) => ghost.update(deltaTime));
    this._pacmanGhostCollision();
  };

  public renderScene = (context: CanvasRenderingContext2D) => {
    this._wallMap.draw(context);
    this._pacman.render(context);
    this._ghosts.forEach((ghost) => ghost.render(context));
  };

  public nextLevel = (): void => {
    if (this._currentLevel === this._maps.length - 1) this._currentLevel = 0;
    else this._currentLevel++;
    this._initMap();
    this._initPlayers();
    // Emit human-friendly level (1-based)
    this.onLevelChange?.(this._currentLevel + 1);
  };

  public initGame = (): void => {
    this._isGameOver = false;
    this._isGameWin = false;
    this._pacmanLife = this._originalPacmanLife;
    this._score = 0;
    this._currentLevel = 0;
    this._initMap();
    this._initPlayers();
    // Emit initial HUD values (score 0, full life, level 1)
    this.onScoreChange?.(this._score);
    this.onPacmanLifeChange?.(this._pacmanLife);
    this.onLevelChange?.(this._currentLevel + 1);
  };

  public dispose = () => {
    this._pacman.dispose();
    this._ghosts.forEach((ghost) => ghost.dispose());
    this._wallMap.dispose();

    this.onGameOver = undefined;
    this.onPacmanLifeChange = undefined;
    this.onScoreChange = undefined;
    this.onLevelChange = undefined;
    this.onGameWin = undefined;
    this.onGameReset = undefined;
    this.onMapChange = undefined;
    this.onEatGhost = undefined;
  };
}
