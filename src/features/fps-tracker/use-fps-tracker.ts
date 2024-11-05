import { RefObject, useEffect, useState } from 'react';
import { FpsTracker } from '@/features/fps-tracker/fps-tracker';

export const useFpsTracker = (canvasRef: RefObject<HTMLCanvasElement>) => {
  const [fpsTracker, setFpsTracker] = useState<FpsTracker | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !canvasRef.current.parentElement) return;

    const tracker = new FpsTracker(canvasRef.current.parentElement);
    setFpsTracker(tracker);

    return tracker.dispose;
  }, [canvasRef]);

  return fpsTracker;
};
