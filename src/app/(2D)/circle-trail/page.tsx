'use client';

import { useEffect, useRef } from 'react';

import { CircleTrailManager } from '@/app/(2D)/circle-trail/circle-trail-manager';
import { AnimationController } from '@/controllers/animation-controller';
import { CanvasController } from '@/controllers/canvas-controller';
import { FpsTracker } from '@/classes/fps-tracker';
import { createGuiControls } from '@/app/(2D)/circle-trail/create-gui-controls';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile === undefined) return;

    const canvasController = CanvasController.of(canvasRef.current);
    const fpsTracker = FpsTracker.of(canvasController.canvas.parentElement!);

    const circleTrailManager = CircleTrailManager.of(canvasController, {
      circleCount: isMobile ? 60 : 200,
      radiusMax: isMobile ? 30 : 40,
    });
    const circleTrail = { value: 0.1 };

    const animationController = AnimationController.of(() => {
      const { width, height, context } = canvasController;
      context.fillStyle = `hsla(0, 0%, 0%, ${circleTrail.value})`;
      context.fillRect(0, 0, width, height);
      circleTrailManager.circles.forEach((circle) => {
        circle.move(width, height);
        circle.draw(context);
      });
      fpsTracker.track();
    });

    const guiControls = createGuiControls(
      animationController,
      circleTrailManager,
      circleTrail,
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
      className="absolute top-0 left-0 w-full h-full bg-black"
    />
  );
}
