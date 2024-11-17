import { ParticleTunnelManager } from '@/app/(2D)/other/particles/tunnel/particles-tunnel-manager';
import { AnimationController } from '@/controllers/animation-controller';

export const createGuiControls = (
  animationController: AnimationController,
  particleTunnelManager: ParticleTunnelManager,
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

      gui.addFolder('Particles');
      gui.add(particleTunnelManager, 'count', 1, 100, 1).name('Count');
      gui.add(particleTunnelManager, 'radius', 1, 100, 1).name('Radius');
      gui.add(particleTunnelManager, 'speed', 1, 20, 1).name('Speed');

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
