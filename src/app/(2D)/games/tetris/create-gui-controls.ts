import { Tetris } from '@/app/(2D)/games/tetris/tetris';
import { AnimationController } from '@/controllers/animation-controller';

export const createGuiControls = (
  animationController: AnimationController,
  tetris: Tetris,
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
          '15 FPS': 15,
          '10 FPS': 10,
        })
        .name('FPS').domElement.style.color = 'black';

      gui.addFolder('Tetris');

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
