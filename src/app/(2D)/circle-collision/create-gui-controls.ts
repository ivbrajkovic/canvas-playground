import { CircleCollisionManager } from '@/app/(2D)/circle-collision/collision-manager';
import { AnimationController } from '@/controllers/animation-controller';

export const createGuiControls = (
  animationController: AnimationController,
  circleCollisionManager: CircleCollisionManager,
) => {
  const guiControls = import('dat.gui')
    .then((dat) => new dat.GUI())
    .then((gui) => {
      gui.domElement.style.marginTop = '64px';
      gui.domElement.style.marginRight = '0px';
      return gui;
    })
    .then((gui) => {
      gui.addFolder('Canvas');
      gui.add(animationController, 'isRunning').name('Animate');

      gui.addFolder('Circles');
      gui
        .add(circleCollisionManager, 'circleCount', 1, 60, 1)
        .name('Count')
        .onFinishChange(circleCollisionManager.populate);

      gui
        .add(circleCollisionManager, 'radiusMin', 1, 60, 1)
        .name('Size Min')
        .onFinishChange(circleCollisionManager.populate);
      gui
        .add(circleCollisionManager, 'radiusMax', 1, 70, 1)
        .name('Size Max')
        .onFinishChange(circleCollisionManager.populate);

      gui
        .add(circleCollisionManager, 'massMin', 1, 100, 0.1)
        .name('Mass Min')
        .onFinishChange(circleCollisionManager.populate);
      gui
        .add(circleCollisionManager, 'massMax', 1, 100, 0.1)
        .name('Mass Max')
        .onFinishChange(circleCollisionManager.populate);

      gui
        .add(circleCollisionManager, 'speedMin', -10, 10, 0.1)
        .name('Speed Min')
        .onFinishChange(circleCollisionManager.populate);
      gui
        .add(circleCollisionManager, 'speedMax', -10, 10, 0.1)
        .name('Speed Max')
        .onFinishChange(circleCollisionManager.populate);

      return gui;
    });

  return () => {
    guiControls.then((gui) => gui.destroy());
  };
};
