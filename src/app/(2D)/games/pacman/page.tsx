'use client';

import { useEffect, useRef, useState } from 'react';

import { Game } from '@/app/(2D)/games/pacman/classes/game';
import {
  GameInfo,
  type GameInfoHandle,
} from '@/app/(2D)/games/pacman/components/game-info';
import { LevaControls } from '@/app/(2D)/games/pacman/components/leva-controls';
import {
  DEFAULT_LEVEL,
  DEFAULT_LIFE,
  DEFAULT_SCORE,
  VELOCITY,
  WALL_SIZE,
} from '@/app/(2D)/games/pacman/constants';
import { map } from '@/app/(2D)/games/pacman/map';
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

  const animation = useAnimationController(() => {
    if (!isCanvasMounted) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    gameRef.current?.renderScene(context);
    fpsTrackerRef.current?.update();
  });

  useEffect(() => {
    if (!isCanvasMounted) return;

    const game = new Game({
      map,
      wallSize: WALL_SIZE,
      velocity: VELOCITY,
      score: DEFAULT_SCORE,
      pacmanLife: DEFAULT_LIFE,
      level: DEFAULT_LEVEL,
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
    gameRef.current?.resetGameState();
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
        <GameInfo
          ref={gameInfoRef}
          initialLife={DEFAULT_LIFE}
          initialScore={DEFAULT_SCORE}
          initialLevel={DEFAULT_LEVEL + 1}
        />
        <canvas ref={canvasRefCallback} className="" />
      </div>

      <GameDialog
        isOpen={isDialogOpen}
        isGameOver={!!gameRef.current?.isGameOver}
        onResume={handleResume}
      />
    </div>
  );
}
