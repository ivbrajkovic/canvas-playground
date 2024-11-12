'use client';

import { useEffect, useRef } from 'react';

import { Game } from '@/app/(2D)/pacman/classes/game';
import { map } from '@/app/(2D)/pacman/map';
import { FpsTracker } from '@/classes/fps-tracker';
import { AnimationController } from '@/controllers/animation-controller';
import { MouseController } from '@/controllers/mouse-controller';
import { useIsMobile } from '@/hooks/use-mobile';
import { resizeCanvas } from '@/utils/resize-canvas';

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile === undefined) return;
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas context not found');

    const fpsTracker = FpsTracker.of(canvas.parentElement!);
    const mouseController = MouseController.of(canvas, {});

    const game = new Game({
      map,
      wallSize: 32,
      velocity: 1,
      pacmanLife: 3,
      handlers: {
        onGameOver: () => {
          alert('Game Over');
        },
        onGameWin: () => {
          alert('You Win!');
        },
        onMapChange: (width, height) => {
          resizeCanvas(canvas, context, width, height);
        },
      },
    });

    const animationController = AnimationController.of(() => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      game.renderScene(context);
      fpsTracker.track();
    });

    return () => {
      mouseController.dispose();
      animationController.stop();
      fpsTracker.dispose();
    };
  }, [isMobile]);

  return (
    <div className="relative flex flex-1 items-center justify-center">
      <canvas ref={canvasRef} className="" />
    </div>
  );
}
