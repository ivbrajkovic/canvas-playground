import { ParticleManager } from '@/app/(2D)/other/particles/rotating/particle-manager';
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

      gui.addFolder('Sphere');
      gui.add(particleManager, 'radius_sp', 1, 10, 0.01).name('Z Axis');
      gui.add(particleManager, 'sphereRadius', 100, 1000, 1).name('Radius');

      gui.addFolder('Particles');
      gui.add(particleManager, 'numToAddEachFrame', 1, 50, 1).name('Add Each Frame');
      gui.add(particleManager, 'attack', 1, 500, 1).name('Attack');
      gui.add(particleManager, 'decay', 1, 500, 1).name('Decay');
      gui.add(particleManager, 'gravity', -0.3, 0.3, 0.001).name('Gravity');

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
