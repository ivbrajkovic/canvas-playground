import { CircleTrailManager } from '@/app/(2D)/circle-trail/circle-trail-manager';
import { createTrailValue } from '@/app/(2D)/circle-trail/create-trail-value';
import { AnimationController } from '@/controllers/animation-controller';

export const createGuiControls = (
  animationController: AnimationController,
  circleTrailManager: CircleTrailManager,
  circleTrail: ReturnType<typeof createTrailValue>,
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
      gui.add(circleTrail, 'normalizedValue', 0, 1).name('Circle Trail');

      gui.addFolder('Circles');
      gui
        .add(circleTrailManager, 'circleCount', 1, 60, 1)
        .name('Count')
        .onFinishChange(circleTrailManager.populate);

      gui
        .add(circleTrailManager, 'radiusMin', 1, 60, 1)
        .name('Size Min')
        .onFinishChange(circleTrailManager.populate);
      gui
        .add(circleTrailManager, 'radiusMax', 1, 70, 1)
        .name('Size Max')
        .onFinishChange(circleTrailManager.populate);

      gui
        .add(circleTrailManager, 'speedMin', -10, 10, 0.1)
        .name('Speed Min')
        .onFinishChange(circleTrailManager.populate);
      gui
        .add(circleTrailManager, 'speedMax', -10, 10, 0.1)
        .name('Speed Max')
        .onFinishChange(circleTrailManager.populate);

      return gui;
    });

  return {
    dispose: () => guiControls.then((gui) => gui.destroy()),
  };
};
