'use client';

import { useEffect, useRef, useState } from 'react';

import { createGuiControls } from '@/app/(2D)/games/tetris/create-gui-controls';
import { Tetris } from '@/app/(2D)/games/tetris/tetris';
import { FpsTracker } from '@/classes/fps-tracker';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AnimationController } from '@/controllers/animation-controller';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tetrisRef = useRef<Tetris | null>(null);
  const isMobile = useIsMobile();

  const [isDialogOpen, setDialogOpen] = useState(true);

  const resetGame = () => {
    setDialogOpen(false);
    tetrisRef.current?.resetGameState();
    tetrisRef.current?.resume();
  };

  const resumeGame = () => {
    setDialogOpen(false);
    tetrisRef.current?.resume();
  };

  useEffect(() => {
    if (isMobile === undefined) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas context not found');

    const fpsTracker = FpsTracker.of(canvas.parentElement!);

    const tetris = new Tetris({
      cellSize: isMobile ? 36 : 48,
      handlers: {
        onGameOver: () => {
          setDialogOpen(true);
        },
      },
    });

    // TODO: Resize using DPI scaling
    const size = tetris.getGridSize();
    canvas.width = size.width;
    canvas.height = size.height;

    tetrisRef.current = tetris;

    const onKeydown = (event: KeyboardEvent) => {
      if (tetris.isPaused) return;
      if (event.key === 'ArrowLeft') tetris.moveLeft();
      if (event.key === 'ArrowRight') tetris.moveRight();
      if (event.key === 'ArrowDown') tetris.moveDown();
      if (event.key === 'ArrowUp') tetris.rotate();
      if (event.key === ' ') tetris.drop();
      if (event.key === 'p') {
        tetris.pause();
        setDialogOpen(true);
      }
    };

    document.addEventListener('keydown', onKeydown);

    const animationController = AnimationController.of(() => {
      tetris.renderGrid(context, canvas.width, canvas.height);
      fpsTracker.track();
    });

    const guiControls = createGuiControls(animationController, tetris, isMobile);

    return () => {
      animationController.stop();
      fpsTracker.dispose();
      guiControls.dispose();
      document.removeEventListener('keydown', onKeydown);
    };
  }, [isMobile]);

  const isStarted = tetrisRef.current?.isStarted;
  const isPaused = tetrisRef.current?.isPaused;
  const isGameOver = tetrisRef.current?.isGameOver;

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-4 bg-[hsla(0,0%,10%,1)]">
      <canvas ref={canvasRef} />

      <Dialog open={isDialogOpen} onOpenChange={resumeGame}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {!isStarted
                ? 'Welcome to Tetris!'
                : isGameOver
                  ? 'Game Over!'
                  : isPaused
                    ? 'Paused'
                    : ''}
            </DialogTitle>
            <DialogDescription>
              {!isStarted ? (
                'Are you ready to play?'
              ) : isGameOver ? (
                <span>Ready for another round?</span>
              ) : isPaused ? (
                'Game paused. Resume or start a new game?'
              ) : null}
            </DialogDescription>
          </DialogHeader>
          {!isStarted ? (
            <div className="grid gap-1 py-2">
              <p>← → : Move piece</p>
              <p>↑ : Rotate piece</p>
              <p>↓ : Move down</p>
              <p>SPACE : Drop piece</p>
              <p>P : Pause game</p>
            </div>
          ) : isGameOver ? (
            <div className="grid gap-1 py-2">
              <p>Best Score: {tetrisRef.current?.bestScore}</p>
              <p>Your Score: {tetrisRef.current?.score}</p>
            </div>
          ) : isPaused ? (
            <div className="grid gap-1 py-2">
              <p>Score: {tetrisRef.current?.score}</p>
            </div>
          ) : null}
          <DialogFooter>
            {!isStarted ? (
              <Button onClick={resumeGame}>Play</Button>
            ) : isGameOver ? (
              <Button onClick={resetGame}>New Game</Button>
            ) : isPaused ? (
              <>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Resume
                  </Button>
                </DialogClose>
                <Button onClick={resetGame}>New Game</Button>
              </>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
