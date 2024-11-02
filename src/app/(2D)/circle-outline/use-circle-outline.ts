import { FpsTracker } from '@/classes/fps-tracker';
import { AnimationController } from '@/controllers/animation-controller';
import { MouseController } from '@/controllers/mouse-controller';
import { CircleOutlineManager } from '@/app/(2D)/circle-outline/circle-outline-manager';
import { CanvasController } from '@/features/2D/classes/canvas-controller';
import { useDatGui } from '@/hooks/use-dat-gui';
import { useEffect, useRef, useState } from 'react';

export const useCircleOutline = () => {
  const [animationController] = useState(() => new AnimationController());
  const [canvasController] = useState(() => new CanvasController());
  const [mouseController] = useState(() => new MouseController());
  const [fpsTracker] = useState(() => new FpsTracker());
  const [circles] = useState(() => new CircleOutlineManager());
  const settingsRef = useRef({ active: true, circle_trail: 0.05 });

  useEffect(() => {
    canvasController.init();
    fpsTracker.init();
    mouseController.init(canvasController.canvas);
    circles.init(canvasController.width, canvasController.height);

    const animation = () => {
      const ballTrail = settingsRef.current.circle_trail;
      const context = canvasController.context;
      context.fillStyle = `rgba(0, 0, 0, ${ballTrail})`;
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
      circles.render(mouseController.x, mouseController.y, context);
      fpsTracker.track();
    };

    animationController.start(animation);

    return () => {
      fpsTracker.dispose();
      mouseController.dispose();
      animationController.stop();
      canvasController.dispose();
    };
  }, [animationController, canvasController, mouseController, fpsTracker, circles]);

  useDatGui((gui) => {
    const settings = circles.settings;
    gui.add(settingsRef.current, 'active').onChange(animationController.toggle);
    gui.add(settings, 'speed_min', -10, 10, 0.1).onFinishChange(circles.populate);
    gui.add(settings, 'speed_max', -10, 10, 0.1).onFinishChange(circles.populate);
    gui.add(settings, 'radius_min', 0, 100, 1).onFinishChange(circles.populate);
    gui.add(settings, 'radius_max', 0, 100, 1).onFinishChange(circles.populate);
    gui.add(settings, 'mouse_radius', 10, 1000, 1).onFinishChange(circles.populate);
    gui.add(settings, 'circle_count', 1, 5000, 1).onFinishChange(circles.populate);
    gui.add(settingsRef.current, 'circle_trail', 0, 0.2, 0.001);
  });
};
