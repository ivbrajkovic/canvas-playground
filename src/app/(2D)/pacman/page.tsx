'use client';

import { useEffect, useRef, useState } from 'react';

import { Game } from '@/app/(2D)/pacman/classes/game';
import { createGuiControls } from '@/app/(2D)/pacman/create-gui-controls';
import { map } from '@/app/(2D)/pacman/map';
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
import { resizeCanvas } from '@/utils/resize-canvas';

const DEFAULT_LIFE = 3;
const DEFAULT_SCORE = 0;
const DEFAULT_LEVEL = 8;

export default function Particles() {
  const isMobile = useIsMobile();
  const gameRef = useRef<Game | null>(null);
  const lifeRef = useRef<HTMLSpanElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const levelRef = useRef<HTMLParagraphElement>(null);
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

    const life = lifeRef.current;
    const score = scoreRef.current;
    const level = levelRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !life || !score || !level) return;

    life.innerText = `${DEFAULT_LIFE}`;
    score.innerText = `${DEFAULT_SCORE}`;
    level.innerText = `${DEFAULT_LEVEL + 1}`;

    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas context not found');

    const fpsTracker = FpsTracker.of(canvas.parentElement!);
    const animationController = AnimationController.of(null);

    const game = new Game({
      map,
      wallSize: 32,
      velocity: 1,
      score: DEFAULT_SCORE,
      pacmanLife: DEFAULT_LIFE,
      level: DEFAULT_LEVEL,
      handlers: {
        onMapChange: (width, height) => resizeCanvas(canvas, context, width, height),
        onGameOver: () => (animationController.stop(), setDialogOpen(true)),
        onGameWin: () => (animationController.stop(), setDialogOpen(true)),
        onPacmanLifeChange: (value) => (life.innerText = `${value}`),
        onScoreChange: (value) => (score.innerText = `${value}`),
        onLevelChange: (value) => (level.innerText = `${value + 1}`),
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

    const guiControls = createGuiControls(animationController, game, isMobile);

    return () => {
      guiControls.dispose();
      animationController.stop();
      fpsTracker.dispose();
    };
  }, [isMobile]);

  return (
    <div className="relative flex flex-1 items-center justify-center">
      <div>
        <div className="flex justify-between">
          <h3 className="font-bold text-gray-500">
            Life <span ref={lifeRef}></span>
          </h3>
          <h3 className="font-bold text-gray-500">
            Level <span ref={levelRef}></span>
          </h3>
          <h3 className="font-bold text-gray-500">
            Score <span ref={scoreRef}></span>
          </h3>
        </div>
        <canvas ref={canvasRef} className="" />
      </div>
      <AlertDialog open={isDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers. Game{' '}
              {gameRef.current?.isGameOver ? 'over' : 'win'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleResume}> Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
