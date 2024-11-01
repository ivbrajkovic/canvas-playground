import { FpsTracker } from '@/classes/fps-tracker';
import { AnimationController } from '@/controllers/animation-controller';
import { MouseController } from '@/controllers/mouse-controller';
import { Particles } from '@/features/2D/circle-outline/particles';
import { CanvasController } from '@/features/2D/classes/canvas-controller';
import { useDatGui } from '@/hooks/use-dat-gui';
import { useEffect, useRef, useState } from 'react';

export const useCircleOutline = () => {
  const [animationController] = useState(() => new AnimationController());
  const [canvasController] = useState(() => new CanvasController());
  const [mouseController] = useState(() => new MouseController());
  const [fpsTracker] = useState(() => new FpsTracker());
  const [particles] = useState(() => new Particles());

  const settingsRef = useRef({ active: true, particle_count: 10 });

  useEffect(() => {
    canvasController.init();
    fpsTracker.init();
    mouseController.init(canvasController.canvas);
    particles.init(canvasController.width, canvasController.height);

    const animation = () => {
      const context = canvasController.context;
      context.fillStyle = 'rgba(0, 0, 0, 0.05)';
      // context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
      particles.update(mouseController.x, mouseController.y, context);
      fpsTracker.track();
    };

    animationController.start(animation);

    return () => {
      fpsTracker.dispose();
      mouseController.dispose();
      animationController.stop();
      canvasController.dispose();
    };
  }, [
    animationController,
    canvasController,
    mouseController,
    fpsTracker,
    particles,
  ]);

  useDatGui((gui) => {
    const settings = particles.settings;
    const initParticles = () =>
      particles.init(canvasController.width, canvasController.height);

    gui.add(settingsRef.current, 'active').onChange(animationController.toggle);
    gui.add(settings, 'speed_min', -10, 10, 0.1).onFinishChange(initParticles);
    gui.add(settings, 'speed_max', -10, 10, 0.1).onFinishChange(initParticles);
    gui.add(settings, 'radius_min', 0, 100, 1).onFinishChange(initParticles);
    gui.add(settings, 'radius_max', 0, 100, 1).onFinishChange(initParticles);
    gui.add(settings, 'mass_min', 0, 10, 1).onFinishChange(initParticles);
    gui.add(settings, 'mass_max', 0, 10, 1).onFinishChange(initParticles);
    gui
      .add(settings, 'particle_count', 1, 5000, 1)
      .onFinishChange(initParticles);
  });
};
