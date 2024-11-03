import { Mouse } from '@/app/(2D)/particles/mouse';
import { ParticleManager } from '@/app/(2D)/particles/particle-manager';
import { FpsTracker } from '@/classes/fps-tracker';
import { AnimationController } from '@/controllers/animation-controller';
import { CanvasController } from '@/features/2D/classes/canvas-controller';
import { useEffect, useRef, useState } from 'react';

export const useParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [animationController] = useState(() => new AnimationController());
  const [canvasController] = useState(() => new CanvasController());
  const [fpsTracker] = useState(() => new FpsTracker());

  useEffect(() => {
    // const canvas = canvasRef.current;
    // if (!canvas) return;

    canvasController.init();
    fpsTracker.init();
    const canvas = canvasController.canvas;

    const mouse = new Mouse();
    const increaseRadius = () => mouse.increaseRadius(10);
    mouse.addMoveListener(canvas, increaseRadius);

    // const onMouseMove = (event: MouseEvent) => {
    //   mouse.x = event.offsetX;
    //   mouse.y = event.offsetY;
    //   mouse.increaseRadius(10);
    // };
    // canvas.addEventListener('mousemove', onMouseMove);

    const particles = new ParticleManager();
    particles.populate(canvas.width, canvas.height);
    // particles.start();

    const animation = () => {
      const context = canvasController.context;
      const canvasWidth = canvasController.width;
      const canvasHeight = canvasController.height;
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      particles.draw(context, mouse.x, mouse.y, mouse.radius);
      mouse.reduceRadius();
      fpsTracker.track();
    };
    animationController.start(animation);

    // window.addEventListener('resize', particles.onResize);
    // window.addEventListener('mousemove', particles.onMouseMove);

    return () => {
      fpsTracker.dispose();
      animationController.stop();
      mouse.removeMoveListener();
      canvasController.dispose();
      // canvas.removeEventListener('mousemove', onMouseMove);
      // span.remove();
      // window.removeEventListener('resize', particles.onResize);
      // window.removeEventListener('mousemove', particles.onMouseMove);
    };
  }, [animationController, canvasController, fpsTracker]);

  return { canvasRef };
};
