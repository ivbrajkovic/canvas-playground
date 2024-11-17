import { Matrix } from '@/app/(2D)/other/matrix/matrix';
import { AnimationController } from '@/controllers/animation-controller';

export const createGuiControls = (
  animationController: AnimationController,
  matrix: Matrix,
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
        .add(matrix, 'ghosting', {
          Off: 1,
          Low: 0.1,
          Medium: 0.08,
          High: 0.05,
          Full: 0.02,
        })
        .name('Ghosting').domElement.style.color = 'black';
      gui
        .add(animationController, 'maxFps', {
          'No Limit': null,
          '60 FPS': 60,
          '30 FPS': 30,
          '20 FPS': 20,
          '15 FPS': 15,
          '10 FPS': 10,
        })
        .name('FPS').domElement.style.color = 'black';

      gui.addFolder('Matrix');
      gui.add(matrix, 'fontSize', 1, 100, 1).name('Font');
      gui.addColor(matrix, 'color').name('Color');

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
