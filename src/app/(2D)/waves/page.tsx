'use client';

import { useEffect, useRef } from 'react';

import { AnimationController } from '@/controllers/animation-controller';
import { CanvasController } from '@/controllers/canvas-controller';
import { FpsTracker } from '@/classes/fps-tracker';
import { Waves } from '@/app/(2D)/waves/waves';
import { createGuiControls } from '@/app/(2D)/waves/create-gui-controls';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasController = CanvasController.of(canvasRef.current);
    const { canvas, context } = canvasController;

    const fpsTracker = FpsTracker.of(canvas.parentElement!);
    const waves = Waves.of(canvas.height / 2);
    const ghosting = { value: 0.06 };

    const animationController = AnimationController.of(() => {
      context.fillStyle = `hsla(0, 0%, 0%, ${ghosting.value})`;
      context.fillRect(0, 0, canvas.width, canvas.height);
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

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
}
