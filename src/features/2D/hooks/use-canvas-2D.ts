import { Canvas2D } from '@/features/2D/classes/canvas';
import { useEffect, useState } from 'react';

export const useCanvas2D = () => {
  const [canvas] = useState<Canvas2D>(() => new Canvas2D());
  useEffect(() => {
    return canvas.destroy();
  }, [canvas]);
  return canvas;
};
