import { CircleOutlineManager } from '@/app/(2D)/circle-outline/circle-outline-manager';
import { BoundedValue } from '@/classes/bounded-value';
import { AnimationController } from '@/controllers/animation-controller';

export const createGuiControls = (
  animationController: AnimationController,
  circleOutlineManager: CircleOutlineManager,
  mouseRadius: BoundedValue,
  isMobile: boolean,
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
      gui
        .add(animationController, 'maxFps', {
          'No Limit': null,
          '60 FPS': 60,
          '30 FPS': 30,
          '20 FPS': 20,
        })
        .name('FPS').domElement.style.color = 'black';

      gui.addFolder('Mouse');
      gui.add(mouseRadius, 'min', 0, 500).name('Radius min');
      gui.add(mouseRadius, 'max', 0, 500).name('Radius max');

      gui.addFolder('Circles');
      gui
        .add(circleOutlineManager, 'circleCount', 1, 60, 1)
        .name('Count')
        .onFinishChange(circleOutlineManager.populate);

      gui
        .add(circleOutlineManager, 'radiusMin', 1, 60, 1)
        .name('Size Min')
        .onFinishChange(circleOutlineManager.populate);
      gui
        .add(circleOutlineManager, 'radiusMax', 1, 70, 1)
        .name('Size Max')
        .onFinishChange(circleOutlineManager.populate);

      gui
        .add(circleOutlineManager, 'speedMin', -10, 10, 0.1)
        .name('Speed Min')
        .onFinishChange(circleOutlineManager.populate);
      gui
        .add(circleOutlineManager, 'speedMax', -10, 10, 0.1)
        .name('Speed Max')
        .onFinishChange(circleOutlineManager.populate);

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
