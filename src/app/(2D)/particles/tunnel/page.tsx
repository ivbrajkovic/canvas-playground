'use client';

import { useEffect, useRef } from 'react';

import { createGuiControls } from '@/app/(2D)/particles/tunnel/create-gui-controls';
import { ParticleTunnelManager } from '@/app/(2D)/particles/tunnel/particles-tunnel-manager';
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
    const particleTunnelManager = ParticleTunnelManager.of();

    let isMouseDown = false;
    const mouseController = MouseController.of(canvasController.canvas, {
      onMouseDown: () => (isMouseDown = true),
      onMouseUp: () => (isMouseDown = false),
    });
    const ghosting = { value: 1 };

    let lastTime = 0;

    const animationController = AnimationController.of((time) => {
      const { context, width, height } = canvasController;
      context.fillStyle = `hsla(0, 0%, 10%, ${ghosting.value})`;
      context.fillRect(0, 0, width, height);
      particleTunnelManager.interval.value += isMouseDown ? -2 : 6;
      const deltaTime = time - lastTime;
      if (deltaTime > particleTunnelManager.interval.value) {
        particleTunnelManager.generateRing(mouseController.x, mouseController.y);
        lastTime = time;
      }
      particleTunnelManager.changeHue();
      particleTunnelManager.drawParticles(context);
      fpsTracker.track();
    });

    const guiControls = createGuiControls(
      animationController,
      particleTunnelManager,
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
