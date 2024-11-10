'use client';

import { useEffect, useRef } from 'react';

import { AnimationController } from '@/controllers/animation-controller';
import { CanvasController } from '@/controllers/canvas-controller';
import { FpsTracker } from '@/classes/fps-tracker';
import { ParticleManager } from '@/app/(2D)/fireworks/particle-manager';
import { createGuiControls } from '@/app/(2D)/fireworks/create-gui-controls';
import { MouseController } from '@/controllers/mouse-controller';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasController = CanvasController.of(canvasRef.current);
    const { canvas, context } = canvasController;

    const particleManager = new ParticleManager();
    const mouseController = MouseController.of(canvas, {
      onMouseDown: ({ x, y }) => {
        particleManager.createParticles(x, y);
      },
    });
    const fpsTracker = FpsTracker.of(canvas.parentElement!);
    const ghosting = { value: 0.1 };

    const animationController = AnimationController.of(() => {
      context.fillStyle = `hsla(0, 0%, 10%, ${ghosting.value})`;
      context.fillRect(0, 0, canvas.width, canvas.height);
      particleManager.filterParticles();
      particleManager.drawParticles(context);
      fpsTracker.track();
    });

    const guiControls = createGuiControls(
      animationController,
      particleManager,
      ghosting,
    );

    return () => {
      mouseController.dispose();
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
