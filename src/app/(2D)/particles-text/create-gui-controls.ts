import { ParticleText } from '@/app/(2D)/particles-text/particle-text';
import { BoundedValue } from '@/classes/bounded-value';
import { AnimationController } from '@/controllers/animation-controller';

export const createGuiControls = (
  animationController: AnimationController,
  particleText: ParticleText,
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

      gui.addFolder('Mouse');
      gui.add(mouseRadius, 'min', 0, 500).name('Radius min');
      gui.add(mouseRadius, 'max', 0, 500).name('Radius max');

      gui.addFolder('Text');
      gui.add(particleText, 'text').name('Text').onFinishChange(particleText.init);
      gui
        .add(particleText, 'fontSize', 1, 100, 1)
        .name('Size')
        .onFinishChange(particleText.init);
      gui
        .add(particleText, 'positionOffset', 1, 50, 1)
        .name('Scale')
        .onFinishChange(particleText.init);

      const link = gui.addFolder('Link');
      link.add(particleText, 'isConnections').name('Show');
      link.add(particleText, 'linkingDistance', 1, 100, 1).name('Distance');
      link.close();

      const colors = gui.addFolder('Colors');
      colors.addColor(particleText, 'lineColor').name('Link');
      colors.addColor(particleText, 'particleColor').name('Particle');
      colors.close();

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
