'use client';

import { DotGuiController } from '@/app/(2D)/particles/dotgui-controller';

import { ParticleManager } from '@/app/(2D)/particles/particle-manager';
import { useEffect, useRef, useState } from 'react';

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<ParticleManager | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return console.error('Canvas element not found');

    const particles = new ParticleManager(canvasRef.current);
    setParticles(particles);

    return particles.dispose;
  }, []);

  useEffect(() => {
    if (!particles) return;

    const mouse = particles.mouse;
    const animation = particles.animationController;

    const datGui = new DotGuiController((gui) => {
      const canvasFolder = gui.addFolder('Canvas');
      canvasFolder.add(animation, 'isAnimating').name('Animate');
      canvasFolder
        .add(particles, 'ghosting', { Off: 1, Low: 0.3, Medium: 0.2, High: 0.1, Full: 0 })
        .name('Ghosting').domElement.style.color = '#000';
      canvasFolder.add(mouse, 'radius', 0, 500, 1).name('Mouse Radius');
      canvasFolder.open();

      const particlesFolder = gui.addFolder('Particles');
      particlesFolder.add(particles, 'isConnections').name('Connect');
      particlesFolder
        .add(particles, 'particleCount', 0, 500, 1)
        .name('Count')
        .onFinishChange(particles.populate);
      particlesFolder.add(particles, 'linkingDistance', 0, 500, 1).name('Distance');
      particlesFolder.open();

      const colorFolder = gui.addFolder('Colors');
      colorFolder.addColor(particles, 'particleColor').name('Particle');
      colorFolder.addColor(particles, 'lineColor').name('Connection');
    });

    return datGui.dispose;
  }, [particles]);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
}
