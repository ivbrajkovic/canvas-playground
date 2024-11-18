'use client';

import { useEffect, useRef, useState } from 'react';

import { createGuiControls } from '@/app/(2D)/games/tetris/create-gui-controls';
import { Tetris } from '@/app/(2D)/games/tetris/tetris';
import { FpsTracker } from '@/classes/fps-tracker';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AnimationController } from '@/controllers/animation-controller';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tetrisRef = useRef<Tetris | null>(null);
  const isMobile = useIsMobile();

  const [isDialogOpen, setDialogOpen] = useState(true);

  const startGame = () => {
    setDialogOpen(false);
    tetrisRef.current?.resetGameState();
    tetrisRef.current?.start();
  };

  useEffect(() => {
    if (isMobile === undefined) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas context not found');

    const fpsTracker = FpsTracker.of(canvas.parentElement!);

    const tetris = new Tetris();
    tetris.onGameOver = () => {
      alert('Game Over!');
    };

    const size = tetris.getSize();
    canvas.width = size.width;
    canvas.height = size.height;

    tetrisRef.current = tetris;

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') tetris.moveLeft();
      if (event.key === 'ArrowRight') tetris.moveRight();
      if (event.key === 'ArrowDown') tetris.moveDown();
      if (event.key === 'ArrowUp') tetris.rotate();
      if (event.key === ' ') tetris.drop();
    };

    document.addEventListener('keydown', onKeydown);

    const animationController = AnimationController.of(() => {
      tetris.draw(context, canvas.width, canvas.height);
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

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-4 bg-[hsla(0,0%,10%,1)]">
      <canvas ref={canvasRef} />
      <h1 className="text-white">
        Tetris Game, use arrow keys to move and rotate the pieces, space to drop.
      </h1>

      <AlertDialog open={isDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {tetrisRef.current?.isGameOver ? 'Game Over!' : 'Welcome to Tetris!'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {tetrisRef.current?.isGameOver ? (
                <span>
                  Score: {tetrisRef.current?.score}
                  <br />
                  High Score: {tetrisRef.current?.bestScore}
                  <br />
                  Game Over! Ready to play again?
                </span>
              ) : (
                'Ready to play?'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={startGame}>Start Game</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
