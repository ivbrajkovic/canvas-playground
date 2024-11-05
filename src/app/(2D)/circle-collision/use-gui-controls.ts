import { useEffect } from 'react';
import { GuiControls } from '@/app/(2D)/particles/dotgui-controller';
import { AnimationController } from '@/features/animation-controller/animation-controller';
import { CircleCollisionManager } from '@/app/(2D)/circle-collision/circle-collision-manager';
import { CanvasController } from '@/features/canvas-controller/canvas-controller';

export const useGuiControls = (
  canvasController: CanvasController | null,
  animationController: AnimationController | null,
  circleCollisionManager: CircleCollisionManager | null,
) => {
  useEffect(() => {
    if (!canvasController || !animationController || !circleCollisionManager) return;

    const populate = () =>
      circleCollisionManager.populate(canvasController.width, canvasController.height);

    const guiControls = new GuiControls();

    guiControls.add((gui) => {
      gui.addFolder('Canvas');
      gui.add(animationController, 'isAnimating').name('Animate');
      gui.addFolder('Circles');
      gui
        .add(circleCollisionManager.settings, 'speedMin', -10, 10, 0.1)
        .name('Speed Min')
        .onFinishChange(populate);
      gui
        .add(circleCollisionManager.settings, 'speedMax', -10, 10, 0.1)
        .name('Speed Max')
        .onFinishChange(populate);
      gui
        .add(circleCollisionManager.settings, 'radiusMin', 1, 60, 1)
        .name('Size Min')
        .onFinishChange(populate);
      gui
        .add(circleCollisionManager.settings, 'radiusMax', 1, 70, 1)
        .name('Size Max')
        .onFinishChange(populate);
      gui
        .add(circleCollisionManager.settings, 'massMin', 1, 100, 0.1)
        .name('Mass Min')
        .onFinishChange(populate);
      gui
        .add(circleCollisionManager.settings, 'massMax', 1, 100, 0.1)
        .name('Mass Max')
        .onFinishChange(populate);
      gui
        .add(circleCollisionManager.settings, 'circleCount', 1, 60, 1)
        .name('Count')
        .onFinishChange(populate);
    });
    return () => guiControls.dispose();
  }, [animationController, circleCollisionManager, canvasController]);
};
