'use client';

import { useEffect, useRef, useState } from 'react';

import { Game } from '@/app/(2D)/games/pacman/classes/game';
import { GameInfo, GameInfoHandle } from '@/app/(2D)/games/pacman/components/game-info';
import { LevaControls } from '@/app/(2D)/games/pacman/components/leva-controls';
import {
  INITIAL_LEVEL,
  INITIAL_LIFE,
  INITIAL_SCORE,
  VELOCITY,
  WALL_SIZE,
} from '@/app/(2D)/games/pacman/constants';
import { map } from '@/app/(2D)/games/pacman/map';
import { Direction } from '@/app/(2D)/games/pacman/utils/enum';
import { FpsTracker } from '@/components/fps-tracker/fps-tracker';
import { Particles } from '@/components/magicui/particles';
import { useAnimationController } from '@/hooks/use-animation-controller';
import { useCanvas } from '@/hooks/use-canvas';
import { useIsMobile } from '@/hooks/use-mobile';
import { resizeCanvas } from '@/utils/resize-canvas';

import { GameDialog } from './components/game-dialog';

export default function Pacman() {
  const gameRef = useRef<Game>(null);
  const gameInfoRef = useRef<GameInfoHandle>(null);
  const fpsTrackerRef = useRef<FpsTracker>(null);

  const isMobile = useIsMobile();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { isCanvasMounted, canvasRefCallback, canvas, context } = useCanvas();

  const animation = useAnimationController((deltaTime) => {
    if (!isCanvasMounted) return;

    gameRef.current?.update(deltaTime);
    context.clearRect(0, 0, canvas.width, canvas.height);
    gameRef.current?.renderScene(context);
    fpsTrackerRef.current?.update();
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const game = gameRef.current;
      if (!game) return;

      let direction: Direction | null = null;
      switch (e.key) {
        case 'ArrowUp':
          direction = Direction.Up;
          break;
        case 'ArrowDown':
          direction = Direction.Down;
          break;
        case 'ArrowLeft':
          direction = Direction.Left;
          break;
        case 'ArrowRight':
          direction = Direction.Right;
          break;
      }

      if (direction !== null) {
        game.pacman.setNextDirection(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!isCanvasMounted) return;

    const game = new Game({
      map,
      wallSize: WALL_SIZE,
      velocity: VELOCITY,
      pacmanLife: INITIAL_LIFE,
      level: INITIAL_LEVEL,
      score: INITIAL_SCORE,
      handlers: {
        onMapChange: (width, height) => resizeCanvas(canvas, context, width, height),
        onGameWin: () => (animation.stop(), setDialogOpen(true)),
        onGameOver: () => (animation.stop(), setDialogOpen(true)),
        onPacmanLifeChange: gameInfoRef.current?.updateLife,
        onScoreChange: gameInfoRef.current?.updateScore,
        onLevelChange: gameInfoRef.current?.updateLevel,
      },
    });
    gameRef.current = game;

    return game.dispose;
  }, [isCanvasMounted, canvas, context, animation]);

  const handleResume = () => {
    setDialogOpen(false);
    gameRef.current?.initGame();
    animation.start();
  };

  return (
    <div className="relative flex flex-1 items-center justify-center">
      <Particles className="absolute inset-0" />
      <div className="absolute right-2 top-2">
        {!isMobile ? <LevaControls gameRef={gameRef} animation={animation} /> : null}
      </div>

      <div>
        <FpsTracker ref={fpsTrackerRef} />
        <GameInfo ref={gameInfoRef} />
        <canvas ref={canvasRefCallback} />
      </div>

      <GameDialog
        isOpen={isDialogOpen}
        isGameOver={!!gameRef.current?.isGameOver}
        onResume={handleResume}
      />
    </div>
  );
}
