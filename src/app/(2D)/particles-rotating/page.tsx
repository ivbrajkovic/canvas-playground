'use client';

import { useEffect, useRef } from 'react';

import { AnimationController } from '@/controllers/animation-controller';
import { CanvasController } from '@/controllers/canvas-controller';
import { FpsTracker } from '@/classes/fps-tracker';
import { createGuiControls } from '@/app/(2D)/particles-rotating/create-gui-controls';
import { ParticleManager } from '@/app/(2D)/particles-rotating/particle-manager';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasController = CanvasController.of(canvasRef.current);
    const { _canvas: canvas, _context: context } = canvasController;

    const particleManager = ParticleManager.of(canvasController._canvas);
    const fpsTracker = FpsTracker.of(canvas.parentElement!);

    canvasController.onResize = particleManager.init;
    const ghosting = { value: 1 };

    const animationController = AnimationController.of(() => {
      context.fillStyle = `hsla(0, 0%, 10%, ${ghosting.value})`;
      context.fillRect(0, 0, canvas.width, canvas.height);
      particleManager.onTimer();
      fpsTracker.track();
    });

    const guiControls = createGuiControls(
      animationController,
      particleManager,
      ghosting,
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
      className="absolute top-0 left-0 w-full h-full bg-[hsla(0,0%,10%,1)]"
    />
  );
}
