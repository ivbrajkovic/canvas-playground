'use client';

import { useEffect, useRef } from 'react';

import { circleCollisionGuiControls } from '@/app/(2D)/circles/collision/cicrle-collision-gui-controls';
import { CircleCollisionManager } from '@/app/(2D)/circles/collision/circle-collision-manager';
import { FpsTracker } from '@/classes/fps-tracker';
import { AnimationController } from '@/controllers/animation-controller';
import { CanvasController } from '@/controllers/canvas-controller';
import { useIsMobile } from '@/hooks/use-mobile';

const CircleCollisionPage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile === undefined) return;

    const canvasController = CanvasController.of(canvasRef.current);
    const fpsTracker = FpsTracker.of(canvasController.canvas.parentElement!);

    const circleCollisionManager = new CircleCollisionManager({
      circleCount: isMobile ? 20 : 40,
      radiusMax: isMobile ? 40 : 50,
    }).populate(canvasController.width, canvasController.height);

    canvasController.onResize = circleCollisionManager.populate;

    const animationController = AnimationController.of(() => {
      const { context, width, height } = canvasController;
      circleCollisionManager.draw(context, width, height);
      fpsTracker.track();
    });

    const guiControls = circleCollisionGuiControls(
      canvasController,
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

  return (
    <canvas
      ref={canvasRef}
      className="absolute left-0 top-0 size-full bg-[hsla(0,0%,10%,1)]"
    />
  );
};

export default CircleCollisionPage;
