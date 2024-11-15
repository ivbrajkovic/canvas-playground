'use client';

import { useEffect, useRef } from 'react';

import { CirclePhysics } from '@/app/(2D)/circle-physics/circle-physics';
import { createGuiControls } from '@/app/(2D)/circle-physics/create-gui-controls';
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

    const ghosting = { value: 1 };

    const canvasController = CanvasController.of(canvasRef.current);
    const fpsTracker = FpsTracker.of(canvasController.canvas.parentElement!);

    const circlePhysics = new CirclePhysics(
      canvasController.width,
      canvasController.height,
    );

    const mouseController = MouseController.of(canvasController.canvas, {
      onMouseDown: (position) => {
        // Reset circle position
        circlePhysics.x = position.x;
        circlePhysics.y = position.y;
        // Reset velocity
        circlePhysics.vx = 0;
        circlePhysics.vy = 0;
        // Save old position
        circlePhysics.oldX = position.x;
        circlePhysics.oldY = position.y;
      },
      onMouseMove: (position) => {
        if (mouseController.isMouseDown) {
          // Update circle position
          circlePhysics.x = position.x;
          circlePhysics.y = position.y;
          // Update velocity based on mouse movement (dragging)
          circlePhysics.vx = position.x - circlePhysics.oldX;
          circlePhysics.vy = position.y - circlePhysics.oldY;
          // Update old position for next frame
          circlePhysics.oldX = position.x;
          circlePhysics.oldY = position.y;
        }
      },
    });

    const animationController = AnimationController.of(() => {
      const { context, width, height } = canvasController;
      context.fillStyle = `hsla(0, 0%, 10%, ${ghosting.value})`;
      context.fillRect(0, 0, width, height);

      circlePhysics.draw(context);
      if (!mouseController.isMouseDown) circlePhysics.update(width, height);

      fpsTracker.track();
    });

    const guiControls = createGuiControls(
      animationController,
      circlePhysics,
      ghosting,
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
}
