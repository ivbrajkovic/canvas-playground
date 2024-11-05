'use client';

import { CircleTrailManager } from '@/app/(2D)/circle-trail/circle-trail-manager';
import { DotGuiController } from '@/app/(2D)/particles/dotgui-controller';
import { useEffect, useRef, useState } from 'react';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [circles, setCircles] = useState<CircleTrailManager | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return console.error('Canvas element not found');

    const circles = new CircleTrailManager(canvasRef.current);
    setCircles(circles);

    return circles.dispose;
  }, []);

  useEffect(() => {
    if (!circles) return;

    const datGui = new DotGuiController((gui) => {
      const canvasFolder = gui.addFolder('Canvas');
      canvasFolder.add(circles, 'isAnimating').name('Animate');
      canvasFolder.add(circles, 'trailing', 0, 1, 0.01).name('Trail');
      canvasFolder.open();

      const circle = gui.addFolder('Circles');
      circle.add(circles, 'circleCount', 0, 1000, 1).name('Count').onFinishChange(circles.populate);
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

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
}
