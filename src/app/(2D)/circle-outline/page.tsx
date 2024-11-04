'use client';

import { CircleOutlineManager } from '@/app/(2D)/circle-outline/circle-outline-manager';
import { CanvasController } from '@/app/(2D)/particles/canvas-controller';
import { DotGuiController } from '@/app/(2D)/particles/dotgui-controller';
import { useEffect, useRef, useState } from 'react';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [circles, setCircles] = useState<CircleOutlineManager | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return console.error('Canvas element not found');

    const canvas = new CanvasController(canvasRef.current);
    const circles = new CircleOutlineManager(canvas.context);

    canvas.onResize = circles.populate;
    circles.populate();
    circles.isAnimating = true;

    setCircles(circles);

    return () => {
      circles.dispose();
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!circles) return;

    const datGui = new DotGuiController();

    datGui.configureGUI((gui) => {
      const canvasFolder = gui.addFolder('Canvas');
      canvasFolder.add(circles, 'isAnimating').name('Animate');
      canvasFolder.add(circles, 'mouseRadius', 0, 500, 1).name('Mouse Radius');
      canvasFolder.open();

      const circle = gui.addFolder('Circles');
      circle
        .add(circles, 'circleCount', 0, 1000, 1)
        .name('Count')
        .onFinishChange(circles.populate);
      circle
        .add(circles, 'speedMin', -10, 10, 0.1)
        .name('Speed Min')
        .onFinishChange(circles.populate);
      circle
        .add(circles, 'speedMax', -10, 10, 0.1)
        .name('Speed Max')
        .onFinishChange(circles.populate);
      circle
        .add(circles, 'radiusMin', 0, 100, 1)
        .name('Radius Min')
        .onFinishChange(circles.populate);
      circle
        .add(circles, 'radiusMax', 0, 100, 1)
        .name('Radius Max')
        .onFinishChange(circles.populate);
      circle.open();
    });

    return datGui.dispose;
  }, [circles]);

  return (
    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
  );
}
