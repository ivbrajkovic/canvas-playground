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
    onMapChange?: (width: number, height: number) => void;
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
  public onMapChange?: (width: number, height: number) => void;
  public onEatGhost?: () => void;

  get isGameOver() {
    return this._isGameOver;
  }

  get IsGameWin() {
    return this._isGameWin;
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

    this._initMap();
    this._initPlayers();
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
    this._pacman.startKeyDownListener();
  }

  private _eatPacman() {
    if (this._pacman.isResetting) return;

    this._pacmanLife--;
    this.onPacmanLifeChange?.(this._pacmanLife);

    if (this._pacmanLife > 0) {
      this._pacman.reset();
    } else {
      this._isGameOver = true;
      this._gameOverSound.play();
      this.onGameOver?.();
    }
  }

  private _eatGhost(ghostIndex: number) {
    this._ghosts[ghostIndex].remove();
    this._ghosts.splice(ghostIndex, 1);
    this._eatGhostSound.play();
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
      this._gameWinSound.play();
      this.onGameWin?.();
    } else {
      this.nextLevel();
    }
  };

  public renderScene = (context: CanvasRenderingContext2D) => {
    this._wallMap.draw(context);
    this._pacman.render(context);
    this._ghosts.forEach((ghost) => ghost.render(context));
    this._pacmanGhostCollision();
  };

  public nextLevel = () => {
    this._currentLevel++;
    this._initMap();
    this._initPlayers();
    this.onLevelChange?.(this._currentLevel);
  };

  public resetGameState = () => {
    this._isGameOver = false;
    this._isGameWin = false;
    this._pacmanLife = this._originalPacmanLife;
    this._score = 0;
    this._initMap();
    this._initPlayers();
    this.onScoreChange?.(this._score);
    this.onPacmanLifeChange?.(this._pacmanLife);
  };

  public dispose = () => {
    this._pacman.removeKeyDownListener();
    this._ghosts.forEach((ghost) => ghost.remove());
  };
}
