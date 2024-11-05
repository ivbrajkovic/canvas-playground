import { RefObject, useEffect, useState } from 'react';
import { CanvasController } from '@/features/canvas-controller/canvas-controller';

export const useCanvasController = (canvasRef: RefObject<HTMLCanvasElement>) => {
  const [canvasController, setCanvasController] = //
    useState<CanvasController | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const controller = new CanvasController(canvasRef.current);
    setCanvasController(controller);

    return controller.dispose;
  }, [canvasRef]);

  return canvasController;
};
