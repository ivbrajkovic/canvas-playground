'use client';

import { useEffect, useRef } from 'react';

import { createGuiControls } from '@/app/(2D)/matrix/create-gui-controls';
import { Matrix } from '@/app/(2D)/matrix/matrix';
import { FpsTracker } from '@/classes/fps-tracker';
import { AnimationController } from '@/controllers/animation-controller';
import { CanvasController } from '@/controllers/canvas-controller';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile === undefined) return;

    const canvasController = CanvasController.of(canvasRef.current);
    const fpsTracker = FpsTracker.of(canvasController.canvas.parentElement!);
    const matrix = Matrix.of(canvasController);
    matrix.populate();

    const animationController = AnimationController.of(
      () => {
        matrix.draw(canvasController.context);
        fpsTracker.track();
      },
      { maxFps: 15 },
    );

    const guiControls = createGuiControls(animationController, matrix, isMobile);

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
