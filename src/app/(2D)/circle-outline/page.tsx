'use client';

import { useEffect, useRef } from 'react';

import { CanvasController } from '@/controllers/canvas-controller';
import { FpsTrackerController } from '@/utils/create-fps-tracker-controller';
import { AnimationController } from '@/controllers/animation-controller';
import { CircleOutlineManager } from '@/app/(2D)/circle-outline/circle-outline-manager';
import { MouseController } from '@/controllers/mouse-controller';
import { BoundedValue } from '@/classes/bounded-value';
import { createGuiControls } from '@/app/(2D)/circle-outline/create-gui-controls';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasController = CanvasController.of(canvasRef.current);
    const { canvas, context } = canvasController;

    const fpsTrackerController = FpsTrackerController.of(canvas.parentElement!);
    const circleOutlineManager = CircleOutlineManager.of(canvas);
    const mouseRadius = BoundedValue.of(250, 100, 500);

    const mouseController = MouseController.of(canvas, {
      onMouseMove: () => (mouseRadius.value += 10),
    });

    const animationController = AnimationController.of(() => {
      context.fillStyle = `hsl(0, 0%, 10%)`;
      context.fillRect(0, 0, canvas.width, canvas.height);
      circleOutlineManager.circles.forEach((circle) => {
        circle.respondToForces(
          mouseController.x,
          mouseController.y,
          mouseRadius.value,
        );
        circle.move(context);
        circle.draw(context);
      });
      fpsTrackerController.track();
      mouseRadius.value -= 4;
    });

    const disposeGuiControls = createGuiControls(
      animationController,
      circleOutlineManager,
      mouseRadius,
    );

    return () => {
      mouseController.dispose();
      animationController.stop();
      fpsTrackerController.dispose();
      canvasController.dispose();
      disposeGuiControls();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
}
