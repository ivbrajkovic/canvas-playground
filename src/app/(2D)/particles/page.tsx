'use client';

import { useParticles } from '@/app/(2D)/particles/use-particles-2';

export default function Particles() {
  const { canvasRef } = useParticles();
  return <canvas id="canvas" />;
  // return <canvas ref={canvasRef} />;
}
