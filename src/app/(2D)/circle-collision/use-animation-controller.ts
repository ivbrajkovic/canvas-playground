import { useEffect, useState } from 'react';
import { AnimationController } from '@/features/animation-controller/animation-controller';

export const useAnimationController = () => {
  const [animationController, setAnimationController] =
    useState<AnimationController | null>(null);

  useEffect(() => {
    const controller = new AnimationController();
    setAnimationController(controller);
    return controller.dispose;
  }, []);

  return animationController;
};
