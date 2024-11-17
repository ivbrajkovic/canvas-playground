import { CircleTrailManager } from '@/app/(2D)/circles/trail/circle-trail-manager';
import { AnimationController } from '@/controllers/animation-controller';
import { CanvasController } from '@/controllers/canvas-controller';

export const createGuiControls = (
  canvasController: CanvasController,
  animationController: AnimationController,
  circleTrailManager: CircleTrailManager,
  isMobile: boolean,
) => {
  const populate = () =>
    circleTrailManager.populate(canvasController.width, canvasController.height);

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
      gui
        .add(circleTrailManager, 'trail', {
          Off: 1,
          Low: 0.2,
          Medium: 0.1,
          High: 0.04,
        })
        .name('Trail').domElement.style.color = 'black';
      gui
        .add(animationController, 'maxFps', {
          'No Limit': null,
          '60 FPS': 60,
          '30 FPS': 30,
          '20 FPS': 20,
        })
        .name('FPS').domElement.style.color = 'black';

      gui.addFolder('Circles');
      gui
        .add(circleTrailManager, 'circleCount', 1, 60, 1)
        .name('Count')
        .onFinishChange(populate);

      gui
        .add(circleTrailManager, 'radiusMin', 1, 60, 1)
        .name('Size Min')
        .onFinishChange(populate);
      gui
        .add(circleTrailManager, 'radiusMax', 1, 70, 1)
        .name('Size Max')
        .onFinishChange(populate);

      gui
        .add(circleTrailManager, 'speedMin', -10, 10, 0.1)
        .name('Speed Min')
        .onFinishChange(populate);
      gui
        .add(circleTrailManager, 'speedMax', -10, 10, 0.1)
        .name('Speed Max')
        .onFinishChange(populate);

      return gui;
    })
    .then((gui) => {
      if (isMobile) gui.close();
      return gui;
    });

  return {
    dispose: () => guiControls.then((gui) => gui.destroy()),
  };
};
