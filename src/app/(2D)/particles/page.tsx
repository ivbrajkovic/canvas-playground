'use client';

import { CanvasController } from '@/app/(2D)/particles/canvas-controller';
import { DotGuiController } from '@/app/(2D)/particles/dotgui-controller';
import { ParticleManager } from '@/app/(2D)/particles/particle-manager';
import { useEffect, useRef } from 'react';

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return console.error('Canvas element not found');

    const canvas = new CanvasController(canvasRef.current);
    const particles = new ParticleManager(canvas.context);

    particles.populate();
    particles.isAnimating = true;

    const datGuiController = new DotGuiController();
    datGuiController.configureGUI((gui) => {
      gui.add(particles, 'isAnimating').name('Animate');
      gui.add(particles, 'particleCount', 0, 500, 1).name('Particle Count');
      gui
        .add(particles, 'connectionDistance', 0, 500, 1)
        .name('Connection Distance');

      const colorFolder = gui.addFolder('Colors');
      colorFolder.addColor(particles, 'particleColor');
      colorFolder.addColor(particles, 'lineColor');
    });

    return () => {
      datGuiController.dispose();
      particles.dispose();
      canvas.dispose();
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
  );
}
