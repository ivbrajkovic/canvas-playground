'use client';

import { useEffect, useRef } from 'react';

import { CanvasController } from '@/controllers/canvas-controller';
import { FpsTrackerController } from '@/utils/create-fps-tracker-controller';
import { AnimationController } from '@/controllers/animation-controller';
import { CircleOutlineManager } from '@/app/(2D)/circle-outline/circle-outline-manager2';
import { MouseController } from '@/controllers/mouse-controller';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasController = CanvasController.of(canvasRef.current);
    const { canvas, context } = canvasController;

    const fpsTracker = FpsTrackerController.of(canvas.parentElement!);
    const circleOutlineManager = CircleOutlineManager.of(canvas);

    const mouseController = MouseController.of(canvas, {
      onMouseMove: ({ x, y }, { dx, dy }) => {
        console.log('onMouseMove', x, y, dx, dy);
      },
    });

    const animationController = AnimationController.of(() => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      circleOutlineManager.circles.forEach((circle) => {
        circle.move(context);
        circle.draw(context);
      });
      fpsTracker.track();
    });

    return () => {
      mouseController.dispose();
      animationController.stop();
      fpsTracker.dispose();
      canvasController.dispose();
    };
  }, []);

  // useEffect(() => {
  //   if (!circles) return;

  //   const datGui = new GuiControls((gui) => {
  //     const canvasFolder = gui.addFolder('Canvas');
  //     canvasFolder.add(circles, 'isAnimating').name('Animate');
  //     canvasFolder.add(circles, 'mouseRadius', 0, 500, 1).name('Mouse Radius');
  //     canvasFolder.open();

  //     const circle = gui.addFolder('Circles');
  //     circle
  //       .add(circles, 'circleCount', 0, 1000, 1)
  //       .name('Count')
  //       .onFinishChange(circles.populate);

  //     circle
  //       .add(circles, 'radiusMin', 0, 100, 1)
  //       .name('Size Min')
  //       .onFinishChange(circles.populate);
  //     circle
  //       .add(circles, 'radiusMax', 0, 100, 1)
  //       .name('Size Max')
  //       .onFinishChange(circles.populate);
  //     circle
  //       .add(circles, 'speedMin', -10, 10, 0.1)
  //       .name('Speed Min')
  //       .onFinishChange(circles.populate);
  //     circle
  //       .add(circles, 'speedMax', -10, 10, 0.1)
  //       .name('Speed Max')
  //       .onFinishChange(circles.populate);
  //     circle.open();
  //   });

  //   return datGui.dispose;
  // }, [circles]);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
}
