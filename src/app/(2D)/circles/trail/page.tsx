'use client';

import { useEffect, useRef } from 'react';

import { FpsTracker } from '@/classes/fps-tracker';
import { AnimationController } from '@/controllers/animation-controller';
import { CanvasController } from '@/controllers/canvas-controller';
import { useIsMobile } from '@/hooks/use-mobile';

import { CircleTrailManager } from './circle-trail-manager';
import { createGuiControls } from './create-gui-controls';

const CircleTrailPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile === undefined) return;

    const canvasController = CanvasController.of(canvasRef.current);
    const fpsTracker = FpsTracker.of(canvasController.canvas);

    const circleTrailManager = CircleTrailManager.of({
      circleCount: isMobile ? 60 : 80,
      radiusMax: isMobile ? 30 : 40,
    }).initializeCircles(canvasController.width, canvasController.height);

    canvasController.onResize = circleTrailManager.initializeCircles;

    const animationController = AnimationController.of(() => {
      const { width, height, context } = canvasController;
      circleTrailManager.renderCircles(context, width, height);
      fpsTracker.track();
    });

    const guiControls = createGuiControls(
      canvasController,
      animationController,
      circleTrailManager,
    );

    isMobile ? guiControls.close() : guiControls.open();

    return () => {
      animationController.stop();
      fpsTracker.dispose();
      guiControls.dispose();
      canvasController.dispose();
    };
  }, [isMobile]);

  return <canvas ref={canvasRef} className="absolute left-0 top-0 size-full bg-black" />;
};

export default CircleTrailPage;
