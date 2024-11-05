import { CircleCollisionManager } from '@/app/(2D)/circle-collision/circle-collision-manager';
import { AnimationController } from '@/app/(2D)/particles/animation-controller';
import { FpsTracker } from '@/classes/fps-tracker';
import { MouseController } from '@/controllers/mouse-controller';
import { CanvasController } from '@/features/2D/classes/canvas-controller';
import { useDatGui } from '@/hooks/use-dat-gui';
import { useEffect, useState } from 'react';

export const useCircleCollision = () => {
  const [animationController] = useState(() => new AnimationController());
  const [canvasController] = useState(() => new CanvasController());
  const [mouseController] = useState(() => new MouseController());
  const [fpsTracker] = useState(() => new FpsTracker());
  const [circles] = useState(() => new CircleCollisionManager());

  useEffect(() => {
    canvasController.init();
    fpsTracker.init();
    mouseController.init(canvasController.canvas);
    circles.init(canvasController.width, canvasController.height);

    const animation = () => {
      const context = canvasController.context;
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      circles.circles.forEach((circle) => {
        circle.update(circles.circles);
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
    gui.add(animationController, 'isAnimating');
    gui.add(settings, 'speedMin', -10, 10, 0.1).name('Speed Min').onFinishChange(circles.populate);
    gui.add(settings, 'speedMax', -10, 10, 0.1).name('Speed Max').onFinishChange(circles.populate);
    gui.add(settings, 'radiusMin', 1, 60, 1).name('Size Min').onFinishChange(circles.populate);
    gui.add(settings, 'radiusMax', 1, 70, 1).name('Size Max').onFinishChange(circles.populate);
    gui.add(settings, 'massMin', 1, 100, 0.1).name('Mass Min').onFinishChange(circles.populate);
    gui.add(settings, 'massMax', 1, 100, 0.1).name('Mass Max').onFinishChange(circles.populate);
    gui.add(settings, 'circleCount', 1, 60, 1).name('Count').onFinishChange(circles.populate);
  });
};
