'use client';

import { useParticles } from '@/app/(2D)/particles/use-particles';

export default function Particles() {
  useParticles();
  return <canvas id="canvas" />;
}
