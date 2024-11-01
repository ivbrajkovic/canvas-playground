'use client';

import { useEffect, useRef, useState } from 'react';

import { useDatGui } from '@/hooks/use-dat-gui';
import { BouncingBalls } from '@/features/2D/bouncing-balls/bouncing-balls';
import { CanvasController } from '@/features/2D/classes/canvas-controller';
import { AnimationController } from '@/controllers/animation-controller';
import { FpsTracker } from '@/classes/fps-tracker';

export const useBouncingBalls = () => {
  const settingsRef = useRef({ ball_trail: 0.05 });
  const [canvas] = useState(() => new CanvasController());
  const [fpsTracker] = useState(() => new FpsTracker());
  const [bouncingBalls] = useState(() => new BouncingBalls());
  const [animationController] = useState(() => new AnimationController());

  useEffect(() => {
    canvas.init();
    fpsTracker.init();
    bouncingBalls.init(canvas.width, canvas.height);

    const animation = () => {
      const ballTrail = settingsRef.current.ball_trail;
      const context = canvas.context;
      context.fillStyle = `rgba(0, 0, 0, ${ballTrail})`;
      context.fillRect(0, 0, canvas.width, canvas.height);
      bouncingBalls.update(context);
      fpsTracker.track();
    };

    animationController.start(animation);

    return () => {
      animationController.dispose();
      fpsTracker.dispose();
      canvas.dispose();
    };
  }, [animationController, bouncingBalls, canvas, fpsTracker]);

  useDatGui((gui) => {
    const settings = bouncingBalls.settings;
    const initBalls = () => bouncingBalls.init(canvas.width, canvas.height);
    gui.add(settings, 'speed_min', -10, 10, 0.1).onFinishChange(initBalls);
    gui.add(settings, 'speed_max', -10, 10, 0.1).onFinishChange(initBalls);
    gui.add(settings, 'radius_min', 0, 100, 1).onFinishChange(initBalls);
    gui.add(settings, 'radius_max', 0, 100, 1).onFinishChange(initBalls);
    gui.add(settings, 'balls_count', 1, 1000, 1).onFinishChange(initBalls);
    gui.add(settingsRef.current, 'ball_trail', 0, 0.2, 0.001);
  });
};
