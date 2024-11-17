'use client';

import { useEffect, useRef } from 'react';

import { createGuiControls } from '@/app/(2D)/other/particles/text/create-gui-controls';
import { ParticleText } from '@/app/(2D)/other/particles/text/particle-text';
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
    const ghosting = { value: 0.01 };

    const mouseRadius = BoundedValue.of(150, 0, 150);
    const mouseController = MouseController.of(canvasController.canvas, {
      onMouseMove: () => (mouseRadius.value += 10),
      onMouseDown: () => (mouseRadius.value = 150),
    });

    const particleText = ParticleText.of(canvasController, 'Ivan');
    particleText.positionOffset = isMobile ? 8 : 16;
    particleText.fontSize = isMobile ? 24 : 32;
    particleText.init();

    canvasController.onResize = particleText.init;

    const animationController = AnimationController.of(() => {
      const { context, width, height } = canvasController;
      context.fillStyle = `hsla(0, 0%, 10%, ${ghosting.value})`;
      context.clearRect(0, 0, width, height);

      particleText.drawScene(
        context,
        mouseController.x,
        mouseController.y,
        mouseRadius.value,
      );

      fpsTracker.track();
      mouseRadius.value -= 4;
    });

    const guiControls = createGuiControls(
      animationController,
      particleText,
      mouseRadius,
      isMobile,
    );

    return () => {
      fpsTracker.dispose();
      guiControls.dispose();
      particleText.dispose();
      animationController.stop();
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
