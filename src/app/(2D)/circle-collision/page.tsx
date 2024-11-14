'use client';

import { useEffect, useRef } from 'react';

import { CircleCollisionManager } from '@/app/(2D)/circle-collision/collision-manager';
import { createGuiControls } from '@/app/(2D)/circle-collision/create-gui-controls';
import { FpsTracker } from '@/classes/fps-tracker';
import { AnimationController } from '@/controllers/animation-controller';
import { CanvasController } from '@/controllers/canvas-controller';
import { useIsMobile } from '@/hooks/use-mobile';

const CircleCollision = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile === undefined) return;

    const canvasController = CanvasController.of(canvasRef.current);
    const fpsTracker = FpsTracker.of(canvasController.canvas.parentElement!);

    const circleCollisionManager = CircleCollisionManager.of(canvasController, {
      circleCount: isMobile ? 20 : 40,
      radiusMax: isMobile ? 40 : 50,
    });

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
