'use client';

import { useEffect, useRef } from 'react';

import { CircleTrailManager } from '@/app/(2D)/circle-trail/circle-trail-manager';
import { AnimationController } from '@/controllers/animation-controller';
import { CanvasController } from '@/controllers/canvas-controller';
import { FpsTracker } from '@/classes/fps-tracker';
import { createGuiControls } from '@/app/(2D)/circle-trail/create-gui-controls';
import { createTrailValue } from '@/app/(2D)/circle-trail/create-trail-value';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasController = CanvasController.of(canvasRef.current);
    const { canvas, context } = canvasController;

    const fpsTracker = FpsTracker.of(canvas.parentElement!);
    const circleTrailManager = CircleTrailManager.of(canvas);
    const circleTrail = createTrailValue(0.1);

    const animationController = AnimationController.of(() => {
      context.fillStyle = `hsla(0, 0%, 0%, ${circleTrail.value})`;
      context.fillRect(0, 0, canvas.width, canvas.height);
      circleTrailManager.circles.forEach((circle) => {
        circle.move(context);
        circle.draw(context);
      });
      fpsTracker.track();
    });

    const guiControls = createGuiControls(
      animationController,
      circleTrailManager,
      circleTrail,
    );

    return () => {
      animationController.stop();
      fpsTracker.dispose();
      guiControls.dispose();
      canvasController.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full bg-black"
    />
  );
}
