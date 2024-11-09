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

    const animationController = AnimationController.of(() => {
      context.fillStyle = `hsl(0, 0%, 10%)`;
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
    );

    return () => {
      mouseController.dispose();
      animationController.stop();
      fpsTrackerController.dispose();
      guiControls.dispose();
      canvasController.dispose();
    };
  }, []);

  // useEffect(() => {
  //   if (!particles) return;

  //   const datGui = new GuiControls((gui) => {
  //     const canvasFolder = gui.addFolder('Canvas');
  //     canvasFolder.add(particles, 'isAnimating').name('Animate');
  //     canvasFolder
  //       .add(particles, 'ghosting', {
  //         Off: 1,
  //         Low: 0.3,
  //         Medium: 0.2,
  //         High: 0.1,
  //         Full: 0,
  //       })
  //       .name('Ghosting').domElement.style.color = '#000';
  //     canvasFolder
  //       .add(particles, 'mouseRadius', 0, 500, 1)
  //       .name('Mouse Radius');
  //     canvasFolder.open();

  //     const particlesFolder = gui.addFolder('Particles');
  //     particlesFolder.add(particles, 'isConnections').name('Connect');
  //     particlesFolder
  //       .add(particles, 'particleCount', 0, 500, 1)
  //       .name('Count')
  //       .onFinishChange(particles.populate);
  //     particlesFolder
  //       .add(particles, 'linkingDistance', 0, 500, 1)
  //       .name('Distance');
  //     particlesFolder.open();

  //     const colorFolder = gui.addFolder('Colors');
  //     colorFolder.addColor(particles, 'particleColor').name('Particle');
  //     colorFolder.addColor(particles, 'lineColor').name('Connection');
  //   });

  //   return datGui.dispose;
  // }, [particles]);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
}
