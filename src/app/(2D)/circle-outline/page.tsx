'use client';

import { useEffect, useRef } from 'react';

import { CanvasController } from '@/controllers/canvas-controller';
import { FpsTracker } from '@/classes/fps-tracker';
import { AnimationController } from '@/controllers/animation-controller';
import { CircleOutlineManager } from '@/app/(2D)/circle-outline/circle-outline-manager';
import { MouseController } from '@/controllers/mouse-controller';
import { BoundedValue } from '@/classes/bounded-value';
import { createGuiControls } from '@/app/(2D)/circle-outline/create-gui-controls';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile === undefined) return;

    const canvasController = CanvasController.of(canvasRef.current);
    const fpsTracker = FpsTracker.of(canvasController.canvas.parentElement!);

    const circleOutlineManager = CircleOutlineManager.of(canvasController, {
      circleCount: isMobile ? 80 : 200,
      radiusMax: isMobile ? 30 : 40,
    });

    canvasController.onResize = circleOutlineManager.populate;

    const mouseRadius = BoundedValue.of(250, 100, 500);
    const mouseController = MouseController.of(canvasController.canvas, {
      onMouseMove: () => (mouseRadius.value += 10),
    });

    const animationController = AnimationController.of(() => {
      const { context, width, height } = canvasController;
      context.fillStyle = `hsl(0, 0%, 10%)`;
      context.fillRect(0, 0, width, height);
      circleOutlineManager.circles.forEach((circle) => {
        circle.respondToForces(
          mouseController.x,
          mouseController.y,
          mouseRadius.value,
        );
        circle.move(width, height);
        circle.draw(context);
      });
      fpsTracker.track();
      mouseRadius.value -= 4;
    });

    const guiControls = createGuiControls(
      animationController,
      circleOutlineManager,
      mouseRadius,
      isMobile,
    );

    return () => {
      mouseController.dispose();
      animationController.stop();
      fpsTracker.dispose();
      guiControls.dispose();
      canvasController.dispose();
    };
  }, [isMobile]);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
}
