import { useEffect, useState } from 'react';
import { CircleCollisionManager } from '@/app/(2D)/circle-collision/circle-collision-manager';
import { CanvasController } from '@/features/canvas-controller/canvas-controller';

export const useCircleCollisionManager = (canvasController: CanvasController | null) => {
  const [circles, setCircles] = useState<CircleCollisionManager | null>(null);

  useEffect(() => {
    if (!canvasController) return;

    const manager = new CircleCollisionManager();
    manager.populate(canvasController.width, canvasController.height);
    setCircles(manager);
  }, [canvasController]);

  return circles;
};
