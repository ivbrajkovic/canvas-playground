'use client';

import { useEffect, useRef } from 'react';
import { CircleCollisionManager } from '@/app/(2D)/circle-collision/collision-manager';
import { FpsTrackerController } from '@/utils/create-fps-tracker-controller';
import { CanvasController } from '@/controllers/canvas-controller';
import { createGuiControls } from '@/app/(2D)/circle-collision/gui-controls';
import { AnimationController } from '@/controllers/animation-controller';

const CircleCollision = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasController = CanvasController.of(canvasRef.current);
    const { canvas, context } = canvasController;

    const circleCollisionManager = CircleCollisionManager.of(canvas);
    const fpsTracker = FpsTrackerController.of(canvas.parentElement!);

    const animationController = AnimationController.of(() => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      circleCollisionManager.circles.forEach((circle) => {
        circle.update(circleCollisionManager.circles);
        circle.move(context);
        circle.draw(context);
      });
      fpsTracker.track();
    });

    const disposeGuiControls = createGuiControls(
      animationController,
      circleCollisionManager,
    );

    return () => {
      animationController.stop();
      fpsTracker.dispose();
      disposeGuiControls();
      canvasController.dispose();
    };
  }, []);

  return <canvas id="canvas" ref={canvasRef} />;
};

export default CircleCollision;
