'use client';

import { createGuiControls } from '@/app/(2D)/particles/create-gui-controls';
import { ParticleManager } from '@/app/(2D)/particles/particle-manager';
import { BoundedValue } from '@/classes/bounded-value';
import { AnimationController } from '@/controllers/animation-controller';
import { CanvasController } from '@/controllers/canvas-controller';
import { MouseController } from '@/controllers/mouse-controller';
import { FpsTracker } from '@/classes/fps-tracker';
import { useEffect, useRef } from 'react';

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const [particles, setParticles] = useState<ParticleManager | null>(null);

  useEffect(() => {
    const canvasController = CanvasController.of(canvasRef.current);
    const { canvas, context } = canvasController;

    const fpsTrackerController = FpsTracker.of(canvas.parentElement!);
    const particleManager = ParticleManager.of(canvas);

    const mouseRadius = BoundedValue.of(250, 0, 250);
    const mouseController = MouseController.of(canvas, {
      onMouseMove: () => (mouseRadius.value += 10),
    });
    const ghosting = { value: 1 };

    const animationController = AnimationController.of(() => {
      context.fillStyle = `hsla(0, 0%, 10%, ${ghosting.value})`;
      context.fillRect(0, 0, canvas.width, canvas.height);
      particleManager.particles.forEach((particle, index) => {
        particle.move(context);
        particle.update(mouseController.x, mouseController.y, mouseRadius.value);
        particleManager.drawParticle(context, particle);
        particleManager.drawLine(context, particle, index);
      });
      fpsTrackerController.track();
      mouseRadius.value -= 4;
    });

    const guiControls = createGuiControls(
      animationController,
      particleManager,
      mouseRadius,
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
