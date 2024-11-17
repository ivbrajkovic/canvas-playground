'use client';

import { useEffect, useRef } from 'react';

import { createGuiControls } from '@/app/(2D)/other/fireworks/create-gui-controls';
import { ParticleManager } from '@/app/(2D)/other/fireworks/particle-manager';
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

    const particleManager = new ParticleManager();
    const mouseController = MouseController.of(canvasController.canvas, {
      onMouseDown: ({ x, y }) => {
        particleManager.createParticles(x, y);
      },
    });
    const ghosting = { value: 0.1 };

    const animationController = AnimationController.of(() => {
      const { context, width, height } = canvasController;
      context.fillStyle = `hsla(0, 0%, 10%, ${ghosting.value})`;
      context.fillRect(0, 0, width, height);
      particleManager.draw(context);
      fpsTracker.track();
    });

    const guiControls = createGuiControls(
      animationController,
      particleManager,
      ghosting,
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

  return (
    <canvas
      ref={canvasRef}
      className="absolute left-0 top-0 size-full bg-[hsla(0,0%,10%,1)]"
    />
  );
}
