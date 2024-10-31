'use client';

import { useEffect, useRef, useState } from 'react';

import { AnimationFrame } from '@/features/2D/classes/animation-frame';
import { useDatGui } from '@/hooks/use-dat-gui';
import { useCanvas2D } from '@/features/2D/hooks/use-canvas-2D';
import { BouncingBalls } from '@/features/2D/bouncing-balls/bouncing-balls';

export const useBouncingBalls = () => {
  const canvas = useCanvas2D();
  const [bouncingBalls] = useState(() => new BouncingBalls());
  const animationSettingsRef = useRef({ ballTrail: 0.05 });

  useDatGui((gui) => {
    const settings = bouncingBalls.settings;
    const createBalls = () =>
      bouncingBalls.createBalls(canvas.width, canvas.height);
    gui.add(settings, 'vMin', -10, 10, 0.1).onFinishChange(createBalls);
    gui.add(settings, 'vMax', -10, 10, 0.1).onFinishChange(createBalls);
    gui.add(settings, 'radiusMin', 0, 100, 1).onFinishChange(createBalls);
    gui.add(settings, 'radiusMax', 0, 100, 1).onFinishChange(createBalls);
    gui.add(settings, 'numberOfBalls', 1, 100, 1).onFinishChange(createBalls);
    gui.add(animationSettingsRef.current, 'ballTrail', 0, 0.2, 0.001);
  });

  useEffect(() => {
    bouncingBalls.createBalls(canvas.width, canvas.height);

    const animation = () => {
      const ballTrail = animationSettingsRef.current.ballTrail;
      const context = canvas.context;
      const ballsCount = bouncingBalls.balls.length;
      const balls = bouncingBalls.balls;
      context.fillStyle = `rgba(0, 0, 0, ${ballTrail})`;
      context.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < ballsCount; i++) {
        balls[i].update(canvas.context);
      }
    };

    const animationFrame = new AnimationFrame(animation);
    animationFrame.start();

    return () => {
      animationFrame.stop();
    };
  }, [bouncingBalls, canvas]);
};
