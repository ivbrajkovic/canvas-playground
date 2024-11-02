'use client';

import { useEffect, useRef, useState } from 'react';

import { useDatGui } from '@/hooks/use-dat-gui';
import { Circles } from '@/app/(2D)/circle-trail/circles';
import { CanvasController } from '@/features/2D/classes/canvas-controller';
import { AnimationController } from '@/controllers/animation-controller';
import { FpsTracker } from '@/classes/fps-tracker';

export const useCircleTrail = () => {
  const [animationController] = useState(() => new AnimationController());
  const [canvasController] = useState(() => new CanvasController());
  const [fpsTracker] = useState(() => new FpsTracker());
  const [circles] = useState(() => new Circles());
  const settingsRef = useRef({ active: true, circle_trail: 0.05 });

  useEffect(() => {
    canvasController.init();
    fpsTracker.init();
    circles.init(canvasController.width, canvasController.height);

    const animation = () => {
      const ballTrail = settingsRef.current.circle_trail;
      const context = canvasController.context;
      context.fillStyle = `rgba(0, 0, 0, ${ballTrail})`;
      context.fillRect(0, 0, canvasController.width, canvasController.height);
      circles.render(context);
      fpsTracker.track();
    };

    animationController.start(animation);

    return () => {
      fpsTracker.dispose();
      animationController.stop();
      canvasController.dispose();
    };
  }, [animationController, circles, canvasController, fpsTracker]);

  useDatGui((gui) => {
    const settings = circles.settings;
    gui.add(settingsRef.current, 'active').onChange(animationController.toggle);
    gui.add(settings, 'speed_min', -10, 10, 0.1).onFinishChange(circles.populate);
    gui.add(settings, 'speed_max', -10, 10, 0.1).onFinishChange(circles.populate);
    gui.add(settings, 'radius_min', 0, 100, 1).onFinishChange(circles.populate);
    gui.add(settings, 'radius_max', 0, 100, 1).onFinishChange(circles.populate);
    gui.add(settings, 'circle_count', 1, 1000, 1).onFinishChange(circles.populate);
    gui.add(settingsRef.current, 'circle_trail', 0, 0.2, 0.001);
  });
};
