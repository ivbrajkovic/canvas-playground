'use client';

import { useEffect, useRef } from 'react';
import { CanvasController } from '@/controllers/canvas-controller';
import { AnimationController } from '@/controllers/animation-controller';
import { FpsTracker } from '@/classes/fps-tracker';
import { CircleCollisionManager } from '@/app/(2D)/circle-collision/collision-manager';
import { createGuiControls } from '@/app/(2D)/circle-collision/create-gui-controls';
import { useIsMobile } from '@/hooks/use-mobile';

const CircleCollision = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile === undefined) return;

    const canvasController = CanvasController.of(canvasRef.current, true);
    const fpsTracker = FpsTracker.of(canvasController.canvas.parentElement!);

    const circleCollisionManager = CircleCollisionManager.of(
      canvasController, //
      { isMobile },
    );

    canvasController.onResize = circleCollisionManager.populate;

    const animationController = AnimationController.of(() => {
      const { width, height, context } = canvasController;
      context.fillStyle = `hsl(0, 0%, 10%)`;
      context.fillRect(0, 0, width, height);
      circleCollisionManager.animate();
      fpsTracker.track();
    });

    const guiControls = createGuiControls(
      animationController,
      circleCollisionManager,
      isMobile,
    );

    return () => {
      animationController.stop();
      fpsTracker.dispose();
      guiControls.dispose();
      canvasController.dispose();
    };
  }, [isMobile]);

  return <canvas id="canvas" ref={canvasRef} />;
};

export default CircleCollision;
