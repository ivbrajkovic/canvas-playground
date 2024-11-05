'use client';

import { useCanvasController } from '@/features/canvas-controller/use-canvas-controller';
import { useAnimationController } from '@/app/(2D)/circle-collision/use-animation-controller';
import { useCircleCollisionManager } from '@/app/(2D)/circle-collision/use-circle-collision-manager';
import { useFpsTracker } from '@/features/fps-tracker/use-fps-tracker';
import { useGuiControls } from '@/app/(2D)/circle-collision/use-gui-controls';

import { useEffect, useRef } from 'react';
import { FpsTracker } from '@/features/fps-tracker/fps-tracker';

const CircleCollision = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const canvasController = useCanvasController(canvasRef);
  const circleCollisionManager = useCircleCollisionManager(canvasController);
  const animationController = useAnimationController();
  useGuiControls(canvasController, animationController, circleCollisionManager);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!animationController || !canvasController || !circleCollisionManager) return;

    const fpsTracker = new FpsTracker(canvasRef.current.parentElement!);

    animationController.start(() => {
      canvasController.draw((context) => {
        const { width, height } = canvasController;
        context.clearRect(0, 0, width, height);
        circleCollisionManager.circles.forEach((circle) => {
          circle.update(circleCollisionManager.circles);
          circle.move(context);
          circle.draw(context);
        });
        fpsTracker.track();
      });
    });

    return () => {
      animationController.stop();
      fpsTracker.dispose();
    };
  }, [animationController, canvasController, circleCollisionManager]);

  return <canvas id="canvas" ref={canvasRef} />;
};

export default CircleCollision;
