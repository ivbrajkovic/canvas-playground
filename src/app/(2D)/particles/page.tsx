'use client';

import { CanvasController } from '@/app/(2D)/particles/canvas-controller';
import { DotGuiController } from '@/app/(2D)/particles/dotgui-controller';
import { Mouse } from '@/app/(2D)/particles/mouse';
import { ParticleManager } from '@/app/(2D)/particles/particle-manager';
import { useEffect, useRef, useState } from 'react';

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<ParticleManager | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return console.error('Canvas element not found');

    const canvas = new CanvasController(canvasRef.current);
    const particles = new ParticleManager(canvas.context);

    canvas.onResize = particles.populate;
    canvas.onMouseMove = particles.;

    particles.populate();
    particles.isAnimating = true;

    setParticles(particles);

    return () => {
      particles.dispose();
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!particles) return;

    const datGui = new DotGuiController();

    datGui.configureGUI((gui) => {
      const canvasFolder = gui.addFolder('Canvas');
      canvasFolder.add(particles, 'isAnimating').name('Animate');
      canvasFolder
        .add(particles, 'ghosting', {
          Off: 1,
          Low: 0.3,
          Medium: 0.2,
          High: 0.1,
          Full: 0,
        })
        .name('Ghosting').domElement.style.color = '#000';
      canvasFolder
        .add(particles, 'mouseRadius', 0, 500, 1)
        .name('Mouse Radius');
      canvasFolder.open();

      const particlesFolder = gui.addFolder('Particles');
      particlesFolder.add(particles, 'connections').name('Connect');
      particlesFolder
        .add(particles, 'particleCount', 0, 500, 1)
        .name('Count')
        .onFinishChange(particles.populate);
      particlesFolder
        .add(particles, 'linkingDistance', 0, 500, 1)
        .name('Distance');
      particlesFolder.open();

      const colorFolder = gui.addFolder('Colors');
      colorFolder.addColor(particles, 'particleColor').name('Particle');
      colorFolder.addColor(particles, 'lineColor').name('Connection');
    });

    return datGui.dispose;
  }, [particles]);

  return (
    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
  );
}
