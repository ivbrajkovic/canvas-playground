'use client';

import { useEffect, useRef } from 'react';

import { AnimationController } from '@/controllers/animation-controller';
import { CanvasController } from '@/controllers/canvas-controller';
import { FpsTracker } from '@/classes/fps-tracker';
import { createGuiControls } from '@/app/(2D)/particles-rotating/create-gui-controls';
import { ParticleManager } from '@/app/(2D)/particles-rotating/particle-manager';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile === undefined) return;

    const canvasController = CanvasController.of(canvasRef.current);
    const fpsTracker = FpsTracker.of(canvasController.canvas.parentElement!);

    const particleManager = ParticleManager.of(canvasController, {
      sphereRadius: isMobile ? 200 : 280,
      radius_sp: isMobile ? 1.2 : 1.5,
    });

    canvasController.onResize = particleManager.init;
    const ghosting = { value: 1 };

    const animationController = AnimationController.of(() => {
      const { context, width, height } = canvasController;
      context.fillStyle = `hsla(0, 0%, 10%, ${ghosting.value})`;
      context.fillRect(0, 0, width, height);
      particleManager.onTimer();
      fpsTracker.track();
    });

    const guiControls = createGuiControls(
      animationController,
      particleManager,
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
      className="absolute top-0 left-0 w-full h-full bg-[hsla(0,0%,10%,1)]"
    />
  );
}
