'use client';

import { CanvasController } from '@/app/(2D)/particles/canvas-controller';
import { DotGuiController } from '@/app/(2D)/particles/dotgui-controller';
import { FpsTracker } from '@/app/(2D)/particles/fps-tracker';
import { Mouse } from '@/app/(2D)/particles/mouse';
import { AnimationController } from '@/app/(2D)/particles/animation-controller';

import { ParticleManager } from '@/app/(2D)/particles/particle-manager';
import { useEffect, useRef, useState } from 'react';

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animation, setAnimation] = useState<AnimationController | null>(null);
  const [particles, setParticles] = useState<ParticleManager | null>(null);
  const [mouse, setMouse] = useState<Mouse | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return console.error('Canvas element not found');

    const canvas = new CanvasController(canvasRef.current);
    const context = canvas.context;
    const width = canvas.width;
    const height = canvas.height;

    const fptTracker = new FpsTracker(canvas.parentElement);
    const animation = new AnimationController();
    const mouse = new Mouse({ maxRadius: 250 });

    // canvas.onResize = particles.populate;

    const particles = new ParticleManager();
    particles.populate(width, height);

    animation.animation = () => {
      particles.clearCanvas(context, width, height);
      particles.render(context, mouse, width, height);
      fptTracker.track();
    };

    // animation.onStart = () => (canvas.onMouseMove = mouse.updateCoords);
    // animation.onStop = () => (canvas.onMouseMove = null);

    animation.isAnimating = true;

    setAnimation(animation);
    setParticles(particles);
    setMouse(mouse);

    return () => {
      fptTracker.dispose();
      animation.dispose();
      particles.dispose();
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!animation || !particles || !mouse) return;

    const datGui = new DotGuiController();

    datGui.configureGUI((gui) => {
      const canvasFolder = gui.addFolder('Canvas');
      canvasFolder.add(animation, 'isAnimating').name('Animate');
      canvasFolder
        .add(particles, 'ghosting', {
          Off: 1,
          Low: 0.3,
          Medium: 0.2,
          High: 0.1,
          Full: 0,
        })
        .name('Ghosting').domElement.style.color = '#000';
      canvasFolder.add(mouse, 'radius', 0, 500, 1).name('Mouse Radius');
      canvasFolder.open();

      const particlesFolder = gui.addFolder('Particles');
      particlesFolder.add(particles, 'isConnections').name('Connect');
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
  }, [animation, mouse, particles]);

  return (
    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
  );
}
