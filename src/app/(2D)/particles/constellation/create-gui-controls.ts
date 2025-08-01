import { ParticleManager } from '@/app/(2D)/particles/constellation/particle-manager';
import { BoundedValue } from '@/classes/bounded-value';
import { AnimationController } from '@/controllers/animation-controller';

export const createGuiControls = (
  animationController: AnimationController,
  particleManager: ParticleManager,
  mouseRadius: BoundedValue,
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
          Low: 0.2,
          Medium: 0.1,
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

      gui.addFolder('Mouse');
      gui.add(mouseRadius, 'min', 0, 500).name('Radius min');
      gui.add(mouseRadius, 'max', 0, 500).name('Radius max');

      gui.addFolder('Particles');
      gui.add(particleManager, 'isConnections').name('Link');
      gui.add(particleManager, 'linkingDistance', 1, 500, 1).name('Link Distance');
      gui
        .add(particleManager, 'particleCount', 1, 500, 1)
        .name('Count')
        .onFinishChange(particleManager.populate);

      const colorFolder = gui.addFolder('Colors');
      colorFolder.addColor(particleManager, 'lineColor').name('Link');
      colorFolder.addColor(particleManager, 'particleColor').name('Particle');

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
