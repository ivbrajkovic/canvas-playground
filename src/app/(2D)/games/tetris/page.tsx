'use client';

import { useEffect, useRef, useState } from 'react';

import { createGuiControls } from '@/app/(2D)/games/tetris/create-gui-controls';
import { Tetris } from '@/app/(2D)/games/tetris/tetris';
import { FpsTracker } from '@/classes/fps-tracker';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AnimationController } from '@/controllers/animation-controller';
import { useIsMobile } from '@/hooks/use-mobile';
import { SwipeDirectionObserver } from '@/utils/swipe-detection';
import { TapDetectorObserver } from '@/utils/tap-detection';

const setCanvasSize = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  dpi = window.devicePixelRatio,
) => {
  canvas.width = width * dpi;
  canvas.height = height * dpi;

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  // reset the current transformation matrix to the identity matrix
  context.transform(1, 0, 0, 1, 0, 0);
  context.scale(dpi, dpi);
};

type DialogType = 'welcome' | 'pause' | 'game-over' | null;

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tetrisRef = useRef<Tetris | null>(null);
  const isMobile = useIsMobile();

  const [dialogState, setDialogState] = useState<DialogType>(null);

  const resetGame = () => {
    setDialogState(null);
    tetrisRef.current?.resetGameState();
    tetrisRef.current?.resume();
  };

  const resumeGame = () => {
    setDialogState(null);
    tetrisRef.current?.resume();
  };

  useEffect(() => {
    if (isMobile === undefined) return;
    setDialogState('welcome');
  }, [isMobile]);

  useEffect(() => {
    if (isMobile === undefined) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas context not found');

    // Get canvas parent height
    const parent = canvas.parentElement!;
    const parentHeight = parent.clientHeight;

    // Calculate cell size based on parent height
    const cellSize = (parentHeight / 20) * 0.8;

    const tetris = new Tetris({
      cellSize,
      handlers: {
        onGameOver: () => {
          setDialogState('game-over');
        },
      },
    });
    tetrisRef.current = tetris;

    const { width, height } = tetris.getGridSize();
    setCanvasSize(canvas, context, width, height);

    const fpsTracker = FpsTracker.of(canvas.parentElement!);

    const animationController = AnimationController.of(() => {
      tetris.renderGrid(context, canvas.width, canvas.height);
      fpsTracker.track();
    });

    const onKeydown = (event: KeyboardEvent) => {
      if (tetris.isPaused) return;
      if (event.key === 'ArrowLeft') tetris.moveLeft();
      if (event.key === 'ArrowRight') tetris.moveRight();
      if (event.key === 'ArrowDown') tetris.moveDown();
      if (event.key === 'ArrowUp') tetris.rotate();
      if (event.key === ' ') tetris.drop();
      if (event.key === 'p') {
        tetris.pause();
        setDialogState('pause');
      }
    };
    document.addEventListener('keydown', onKeydown);

    const swipeDirectionObserver = SwipeDirectionObserver.of(canvas);
    swipeDirectionObserver.observe((direction) => {
      if (tetris.isPaused) return;
      if (direction === 'left') tetris.moveLeft();
      if (direction === 'right') tetris.moveRight();
      if (direction === 'down') tetris.moveDown();
      if (direction === 'up') tetris.rotate();
    });

    const tapDetectorObserver = TapDetectorObserver.of(canvas);
    tapDetectorObserver.observe((tapType) => {
      if (tetris.isPaused) return;
      if (tapType === 'double-tap') tetris.drop();
    });

    const guiControls = createGuiControls(animationController, tetris, isMobile);

    return () => {
      animationController.stop();
      fpsTracker.dispose();
      guiControls.dispose();
      tapDetectorObserver.dispose();
      swipeDirectionObserver.dispose();
      document.removeEventListener('keydown', onKeydown);
    };
  }, [isMobile]);

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-4 bg-[hsla(0,0%,10%,1)]">
      <canvas ref={canvasRef} />

      {isMobile ? (
        <Button
          className="absolute bottom-4 right-4 rounded-full"
          onClick={() => {
            tetrisRef.current?.pause();
            setDialogState('pause');
          }}
        >
          P
        </Button>
      ) : null}

      <Dialog open={dialogState !== null}>
        <DialogContent className="w-11/12 sm:max-w-md [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>
              {dialogState === 'welcome'
                ? 'Welcome to Tetris!'
                : dialogState === 'pause'
                  ? 'Game Paused!'
                  : dialogState === 'game-over'
                    ? 'Game Over!'
                    : null}
            </DialogTitle>
            <DialogDescription>
              {dialogState === 'welcome'
                ? 'Are you ready to play?'
                : dialogState === 'pause'
                  ? 'Game paused. Resume or start a new game?'
                  : dialogState === 'game-over'
                    ? 'Ready for another round?'
                    : null}
            </DialogDescription>
          </DialogHeader>
          {dialogState === 'welcome' ? (
            <div className="grid gap-1 py-2">
              {isMobile ? (
                <>
                  <p>Swipe ← → ↓ ↑ : Move piece</p>
                  <p>Swipe ↓ : Drop piece</p>
                  <p>Swipe ↑ : Rotate piece</p>
                  <p>Double Tap : Drop piece</p>
                  <p>P : Pause game</p>
                </>
              ) : (
                <>
                  <p>← → : Move piece</p>
                  <p>↑ : Rotate piece</p>
                  <p>↓ : Move down</p>
                  <p>SPACE : Drop piece</p>
                  <p>P : Pause game</p>
                </>
              )}
            </div>
          ) : dialogState === 'pause' ? (
            <p>Score: {tetrisRef.current?.score}</p>
          ) : dialogState === 'game-over' ? (
            <>
              <p>Best Score: {tetrisRef.current?.bestScore}</p>
              <p>Your Score: {tetrisRef.current?.score}</p>
            </>
          ) : null}
          <DialogFooter>
            <div className="flex justify-end gap-3">
              {dialogState === 'welcome' ? (
                <Button onClick={resumeGame}>Play</Button>
              ) : dialogState === 'pause' ? (
                <>
                  <Button variant="secondary" onClick={resumeGame}>
                    Resume
                  </Button>
                  <Button onClick={resetGame}>New Game</Button>
                </>
              ) : dialogState === 'game-over' ? (
                <Button onClick={resetGame}>New Game</Button>
              ) : null}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
