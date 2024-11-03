import { CanvasController } from '@/app/(2D)/particles/canvas-controller';
import { ParticleManager } from '@/app/(2D)/particles/particle-manager';
import { useEffect, useRef } from 'react';

export const useParticles = () => {
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

  return { canvasRef };
};
