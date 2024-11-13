'use client';

import { useEffect, useRef, useState } from 'react';

import { Game } from '@/app/(2D)/pacman/classes/game';
import { map } from '@/app/(2D)/pacman/map';
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
import { resizeCanvas } from '@/utils/resize-canvas';

export default function Particles() {
  const isMobile = useIsMobile();
  const gameRef = useRef<Game | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<AnimationController | null>(null);

  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleResume = () => {
    setDialogOpen(false);
    gameRef.current?.resetGameState();
    animationRef.current?.start();
  };

  useEffect(() => {
    if (isMobile === undefined) return;
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas context not found');

    const fpsTracker = FpsTracker.of(canvas.parentElement!);
    const animationController = AnimationController.of(null);

    const game = new Game({
      map,
      wallSize: 32,
      velocity: 1,
      pacmanLife: 1,
      handlers: {
        onMapChange: (width, height) => resizeCanvas(canvas, context, width, height),
        onGameOver: () => (animationController.stop(), setDialogOpen(true)),
        onGameWin: () => (animationController.stop(), setDialogOpen(true)),
      },
    });

    animationController.frameCallback = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      game.renderScene(context);
      fpsTracker.track();
    };

    animationController.isRunning = true;
    gameRef.current = game;
    animationRef.current = animationController;

    return () => {
      animationController.stop();
      fpsTracker.dispose();
    };
  }, [isMobile]);

  return (
    <div className="relative flex flex-1 items-center justify-center">
      <canvas ref={canvasRef} className="" />
      <Dialog open={isDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers. Game{' '}
              {gameRef.current?.isGameOver ? 'over' : 'win'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleResume}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
