import { ParticleManager } from '@/app/(2D)/particles/particle-manager';
import { FpsTracker } from '@/classes/fps-tracker';
import { AnimationController } from '@/controllers/animation-controller';
import { MouseController } from '@/controllers/mouse-controller';
import { CanvasController } from '@/features/2D/classes/canvas-controller';
import { useDatGui } from '@/hooks/use-dat-gui';
import { useEffect, useRef, useState } from 'react';

export const useParticles = () => {
  const [animationController] = useState(() => new AnimationController());
  const [canvasController] = useState(() => new CanvasController());
  const [mouseController] = useState(() => new MouseController());
  const [fpsTracker] = useState(() => new FpsTracker());
  const [particles] = useState(() => new ParticleManager());
  const settingsRef = useRef({
    active: true,
    particle_color: '#ffffff',
    line_color: '#ffffff',
  });

  useEffect(() => {
    canvasController.init();
    fpsTracker.init();
    mouseController.init(canvasController.canvas);
    particles.init(canvasController.width, canvasController.height);

    const animation = () => {
      const context = canvasController.context;
      const mouseX = mouseController.x;
      const mouseY = mouseController.y;
      const mouseRadius = particles.settings.mouse_radius;

      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      particles.circles.forEach((particle) => {
        // particle.processRadius(mouseX, mouseY, mouseRadius);
        particle.drawLine(context, particles.circles);
        particle.move(context);
        // particle.draw(context);
      });
      fpsTracker.track();
    };

    animationController.start(animation);

    return () => {
      fpsTracker.dispose();
      mouseController.dispose();
      animationController.stop();
      canvasController.dispose();
    };
  }, [animationController, canvasController, mouseController, fpsTracker, particles]);

  useDatGui((gui) => {
    const settings = particles.settings;
    const populate = () => particles.populate();

    gui.add(settingsRef.current, 'active').onChange(animationController.toggle);

    const particle = gui.addFolder('Particle');
    particle.add(settings, 'vector_min', -10, 10, 0.1).onFinishChange(populate);
    particle.add(settings, 'vector_max', -10, 10, 0.1).onFinishChange(populate);
    particle.add(settings, 'radius_min', 1, 10, 1).onFinishChange(populate);
    particle.add(settings, 'radius_max', 1, 10, 1).onFinishChange(populate);
    particle.add(settings, 'particle_count', 1, 5000, 1).onFinishChange(populate);
    particle.open();

    const colors = gui.addFolder('Colors');
    colors.addColor(settingsRef.current, 'particle_color').onFinishChange(populate);
    colors.addColor(settingsRef.current, 'line_color').onFinishChange(populate);

    const mouse = gui.addFolder('Mouse');
    mouse.add(settings, 'mouse_radius', 10, 1000, 1).onFinishChange(populate);
  });
};
