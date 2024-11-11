import { ParticleManager } from '@/app/(2D)/fireworks/particle-manager';
import { AnimationController } from '@/controllers/animation-controller';

export const createGuiControls = (
  animationController: AnimationController,
  particleManager: ParticleManager,
  ghosting: { value: number },
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
        .add(ghosting, 'value', {
          Off: 1,
          Low: 0.1,
          Medium: 0.06,
          High: 0.04,
        })
        .name('Ghosting').domElement.style.color = 'black';
      gui
        .add(animationController, 'maxFps', {
          'No Limit': null,
          '60 FPS': 60,
          '30 FPS': 30,
          '20 FPS': 20,
        })
        .name('FPS').domElement.style.color = 'black';

      gui.addFolder('Fireworks');
      gui.add(particleManager, 'count', 0, 1000).name('Count');
      gui.add(particleManager, 'radius', 1, 10).name('Radius');
      gui.add(particleManager, 'gravity', 0, 1).name('Gravity');
      gui.add(particleManager, 'friction', 0.01, 0.05).name('Friction');
      gui.add(particleManager, 'alphaDecay', 0.001, 0.01).name('Alpha Decay');

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
