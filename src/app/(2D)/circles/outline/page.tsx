'use client';

import { useEffect, useRef } from 'react';

import { CircleOutlineManager } from '@/app/(2D)/circles/outline/circle-outline-manager';
import { createGuiControls } from '@/app/(2D)/circles/outline/create-gui-controls';
import { BoundedValue } from '@/classes/bounded-value';
import { FpsTracker } from '@/classes/fps-tracker';
import { AnimationController } from '@/controllers/animation-controller';
import { CanvasController } from '@/controllers/canvas-controller';
import { MouseController } from '@/controllers/mouse-controller';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile === undefined) return;

    const canvasController = CanvasController.of(canvasRef.current);
    const fpsTracker = FpsTracker.of(canvasController.canvas.parentElement!);

    const circleOutlineManager = new CircleOutlineManager({
      circleCount: isMobile ? 80 : 200,
      radiusMax: isMobile ? 30 : 40,
    }).populate(canvasController.width, canvasController.height);

    canvasController.onResize = circleOutlineManager.populate;

    const mouseRadius = BoundedValue.of(250, 100, 350);
    const mouseController = MouseController.of(canvasController.canvas, {
      onMouseMove: () => (mouseRadius.value += 10),
    });

    const animationController = AnimationController.of(() => {
      const { context, width, height } = canvasController;
      const { x, y } = mouseController;
      const radius = mouseRadius.value;
      circleOutlineManager.respondToForces(x, y, radius);
      circleOutlineManager.draw(context, width, height);
      mouseRadius.value -= 4;
      fpsTracker.track();
    });

    const guiControls = createGuiControls(
      canvasController,
      animationController,
      circleOutlineManager,
      mouseRadius,
      isMobile,
    );

    return () => {
      animationController.stop();
      fpsTracker.dispose();
      guiControls.dispose();
      mouseController.dispose();
      canvasController.dispose();
    };
  }, [isMobile]);

  return <canvas ref={canvasRef} className="absolute left-0 top-0 size-full" />;
}
