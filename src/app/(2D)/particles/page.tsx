'use client';

import { CanvasController } from '@/app/(2D)/particles/canvas-controller';
import { ParticleManager } from '@/app/(2D)/particles/particle-manager';
import { useEffect, useRef } from 'react';

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return console.error('Canvas element not found');

    const canvas = new CanvasController(canvasRef.current);
    const particles = new ParticleManager(canvas.context);
    particles.populate();
    particles.startAnimation();

    return () => {
      particles.dispose();
      canvas.dispose();
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
  );
}
