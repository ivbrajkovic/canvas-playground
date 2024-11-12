'use client';

import { useEffect, useRef } from 'react';

import { createGuiControls } from '@/app/(2D)/waves/create-gui-controls';
import { Waves } from '@/app/(2D)/waves/waves';
import { FpsTracker } from '@/classes/fps-tracker';
import { AnimationController } from '@/controllers/animation-controller';
import { CanvasController } from '@/controllers/canvas-controller';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasController = CanvasController.of(canvasRef.current);
    const fpsTracker = FpsTracker.of(canvasController.canvas.parentElement!);
    const waves = Waves.of(canvasController.height / 2);
    const ghosting = { value: 0.06 };

    const animationController = AnimationController.of(() => {
      const { context, width, height } = canvasController;
      context.fillStyle = `hsla(0, 0%, 10%, ${ghosting.value})`;
      context.fillRect(0, 0, width, height);
      waves.draw(context);
      fpsTracker.track();
    });

    const guiControls = createGuiControls(animationController, waves, ghosting);

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
      className="absolute left-0 top-0 size-full bg-[hsla(0,0%,10%,1)]"
    />
  );
}
