'use client';

import { CircleCollisionManager } from '@/app/(2D)/circle-collision/circle-collision-manager';
import { AnimationController } from '@/app/(2D)/particles/animation-controller';
import { CanvasController } from '@/app/(2D)/particles/canvas-controller-2';
import { FpsTracker } from '@/app/(2D)/particles/fps-tracker';
import { useDatGui } from '@/hooks/use-dat-gui';
import { useEffect, useRef, useState } from 'react';

const CircleCollision = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [circles] = useState(() => new CircleCollisionManager());
  const [animationController] = useState(() => new AnimationController());

  useEffect(() => {
    if (!canvasRef.current) return console.error('Canvas element not found');

    const canvasController = new CanvasController(canvasRef.current);
    const fpsTracker = new FpsTracker(canvasRef.current.parentElement!);

    circles.init(canvasController.width, canvasController.height);

    animationController.start(() => {
      canvasController.draw((context) => {
        context.clearRect(
          0,
          0,
          canvasController.width,
          canvasController.height,
        );
        circles.circles.forEach((circle) => {
          circle.update(circles.circles);
          circle.move(context);
          circle.draw(context);
        });
        fpsTracker.track();
      });
    });

    return () => {
      fpsTracker.dispose();
      animationController.stop();
      canvasController.dispose();
    };
  }, [animationController, circles]);

  useEffect(() => {
    if (!canvasRef.current) return console.error('Canvas element not found');

    

    return () => {};
  }, []);

  useDatGui((gui) => {
    gui.add(animationController, 'isAnimating');
    gui
      .add(circles.settings, 'speedMin', -10, 10, 0.1)
      .name('Speed Min')
      .onFinishChange(circles.populate);
    gui
      .add(circles.settings, 'speedMax', -10, 10, 0.1)
      .name('Speed Max')
      .onFinishChange(circles.populate);
    gui
      .add(circles.settings, 'radiusMin', 1, 60, 1)
      .name('Size Min')
      .onFinishChange(circles.populate);
    gui
      .add(circles.settings, 'radiusMax', 1, 70, 1)
      .name('Size Max')
      .onFinishChange(circles.populate);
    gui
      .add(circles.settings, 'massMin', 1, 100, 0.1)
      .name('Mass Min')
      .onFinishChange(circles.populate);
    gui
      .add(circles.settings, 'massMax', 1, 100, 0.1)
      .name('Mass Max')
      .onFinishChange(circles.populate);
    gui
      .add(circles.settings, 'circleCount', 1, 60, 1)
      .name('Count')
      .onFinishChange(circles.populate);
  });

  return <canvas id="canvas" ref={canvasRef} />;
};

export default CircleCollision;
