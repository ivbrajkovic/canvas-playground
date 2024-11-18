'use client';

import { useEffect, useRef } from 'react';

import { createGuiControls } from '@/app/(2D)/games/tetris/create-gui-controls';
import { Tetris } from '@/app/(2D)/games/tetris/tetris';
import { FpsTracker } from '@/classes/fps-tracker';
import { AnimationController } from '@/controllers/animation-controller';
import { CanvasController } from '@/controllers/canvas-controller';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile === undefined) return;

    const canvasController = CanvasController.of(canvasRef.current);
    const fpsTracker = FpsTracker.of(canvasController.canvas.parentElement!);

    const tetris = new Tetris();
    tetris.onGameOver = () => {
      alert('Game Over!');
      tetris.init();
    };

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') tetris.moveLeft();
      if (event.key === 'ArrowRight') tetris.moveRight();
      if (event.key === 'ArrowDown') tetris.moveDown();
      if (event.key === 'ArrowUp') tetris.moveUp();
      if (event.key === ' ') tetris.rotate();
    };

    document.addEventListener('keydown', onKeydown);

    const animationController = AnimationController.of(() => {
      const { context, width, height } = canvasController;
      tetris.draw(context, width, height);
      fpsTracker.track();
    });

    const guiControls = createGuiControls(animationController, tetris, isMobile);

    return () => {
      animationController.stop();
      fpsTracker.dispose();
      guiControls.dispose();
      document.removeEventListener('keydown', onKeydown);
      canvasController.dispose();
    };
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute left-0 top-0 size-full bg-[hsla(0,0%,10%,1)]"
    />
  );
}
