import { CircleCollisionManager } from '@/app/(2D)/circle-collision/circle-collision-manager';
import { FpsTracker } from '@/classes/fps-tracker';
import { AnimationController } from '@/controllers/animation-controller';
import { MouseController } from '@/controllers/mouse-controller';
import { CanvasController } from '@/features/2D/classes/canvas-controller';
import { useDatGui } from '@/hooks/use-dat-gui';
import { useEffect, useRef, useState } from 'react';

export const useCircleCollision = () => {
  const [animationController] = useState(() => new AnimationController());
  const [canvasController] = useState(() => new CanvasController());
  const [mouseController] = useState(() => new MouseController());
  const [fpsTracker] = useState(() => new FpsTracker());
  const [circles] = useState(() => new CircleCollisionManager());
  const settingsRef = useRef({ active: true });

  useEffect(() => {
    canvasController.init();
    fpsTracker.init();
    mouseController.init(canvasController.canvas);
    circles.init(canvasController.width, canvasController.height);

    const animation = () => {
      const context = canvasController.context;
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      circles.circles.forEach((circle) => {
        circle.processCircleCollisions(circles.circles);
        circle.move(context);
        circle.draw(context);
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
  }, [animationController, canvasController, mouseController, fpsTracker, circles]);

  useDatGui((gui) => {
    const settings = circles.settings;
    gui.add(settingsRef.current, 'active').onChange(animationController.toggle);
    gui.add(settings, 'speed_min', -10, 10, 0.1).onFinishChange(circles.populate);
    gui.add(settings, 'speed_max', -10, 10, 0.1).onFinishChange(circles.populate);
    gui.add(settings, 'radius_min', 1, 60, 1).onFinishChange(circles.populate);
    gui.add(settings, 'radius_max', 1, 70, 1).onFinishChange(circles.populate);
    gui.add(settings, 'mass_min', 1, 100, 0.1).onFinishChange(circles.populate);
    gui.add(settings, 'mass_max', 1, 100, 0.1).onFinishChange(circles.populate);
    gui.add(settings, 'circle_count', 1, 60, 1).onFinishChange(circles.populate);
  });
};
