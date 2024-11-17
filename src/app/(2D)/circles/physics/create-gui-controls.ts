import { CirclePhysics } from '@/app/(2D)/circles/physics/circle-physics';
import { AnimationController } from '@/controllers/animation-controller';

export const createGuiControls = (
  animationController: AnimationController,
  circlePhysics: CirclePhysics,
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
        .add(circlePhysics, 'ghosting', {
          Off: 1,
          Low: 0.1,
          Medium: 0.06,
          High: 0.04,
        })
        .name('Ghosting').domElement.style.color = 'black';

      gui.addFolder('Circle');
      gui.add(circlePhysics, 'radius', 10, 100).name('Radius');
      gui.add(circlePhysics, 'friction', 0, 0.999).name('Friction');
      gui.add(circlePhysics, 'gravity', 0, 1).name('Gravity');
      gui.add(circlePhysics, 'bounce', -1, 0).name('Bounce');
      gui.add(circlePhysics, 'hue', 0, 360).name('Hue');

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
