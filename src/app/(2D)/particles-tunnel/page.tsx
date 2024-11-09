'use client';
import { useEffect, useRef } from 'react';

import { AnimationController } from '@/controllers/animation-controller';
import { CanvasController } from '@/controllers/canvas-controller';
import { MouseController } from '@/controllers/mouse-controller';
import { FpsTracker } from '@/classes/fps-tracker';
import { ParticleTunnelManager } from '@/app/(2D)/particles-tunnel/particles-tunnel-manager';
import { createGuiControls } from '@/app/(2D)/particles-tunnel/create-gui-controls';

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasController = CanvasController.of(canvasRef.current);
    const { canvas, context } = canvasController;

    const fpsTrackerController = FpsTracker.of(canvas.parentElement!);
    const particleTunnelManager = ParticleTunnelManager.of(canvas);

    let isMouseDown = false;
    const mouseController = MouseController.of(canvas, {
      onMouseDown: () => (isMouseDown = true),
      onMouseUp: () => (isMouseDown = false),
    });
    const ghosting = { value: 1 };

    let lastTime = 0;

    const animationController = AnimationController.of((time) => {
      context.fillStyle = `hsla(0, 0%, 10%, ${ghosting.value})`;
      context.fillRect(0, 0, canvas.width, canvas.height);

      particleTunnelManager.interval.value += isMouseDown ? -2 : 6;

      const deltaTime = time - lastTime;
      if (deltaTime > particleTunnelManager.interval.value) {
        particleTunnelManager.generateRing(mouseController.x, mouseController.y);
        lastTime = time;
      }
      particleTunnelManager.changeHue();
      particleTunnelManager.drawParticles(context);
      fpsTrackerController.track();
    });

    const guiControls = createGuiControls(
      animationController,
      particleTunnelManager,
      ghosting,
    );

    return () => {
      mouseController.dispose();
      animationController.stop();
      fpsTrackerController.dispose();
      guiControls.dispose();
      canvasController.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
}
