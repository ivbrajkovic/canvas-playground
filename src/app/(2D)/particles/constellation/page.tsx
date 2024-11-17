'use client';

import { useEffect, useRef } from 'react';

import { createGuiControls } from '@/app/(2D)/particles/constellation/create-gui-controls';
import { ParticleManager } from '@/app/(2D)/particles/constellation/particle-manager';
import { BoundedValue } from '@/classes/bounded-value';
import { FpsTracker } from '@/classes/fps-tracker';
import { AnimationController } from '@/controllers/animation-controller';
import { CanvasController } from '@/controllers/canvas-controller';
import { MouseController } from '@/controllers/mouse-controller';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile === undefined) return;

    const canvasController = CanvasController.of(canvasRef.current);
    const fpsTracker = FpsTracker.of(canvasController.canvas.parentElement!);

    const particleManager = ParticleManager.of(canvasController, {
      particleCount: isMobile ? 80 : 200,
      linkingDistance: isMobile ? 80 : 120,
    });

    canvasController.onResize = particleManager.populate;

    const mouseRadius = BoundedValue.of(250, 0, 250);
    const mouseController = MouseController.of(canvasController.canvas, {
      onMouseMove: () => (mouseRadius.value += 10),
      onMouseDown: () => (mouseRadius.value = 250),
    });
    const ghosting = { value: 1 };

    const animationController = AnimationController.of(() => {
      const { context, width, height } = canvasController;
      context.fillStyle = `hsla(0, 0%, 10%, ${ghosting.value})`;
      context.fillRect(0, 0, width, height);
      particleManager.particles.forEach((particle, index) => {
        particle.move(width, height);
        particle.update(mouseController.x, mouseController.y, mouseRadius.value);
        particleManager.drawParticle(context, particle);
        particleManager.drawLine(context, particle, index);
      });
      fpsTracker.track();
      mouseRadius.value -= 4;
    });

    const guiControls = createGuiControls(
      animationController,
      particleManager,
      mouseRadius,
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

  return <canvas ref={canvasRef} className="absolute left-0 top-0 size-full" />;
}
