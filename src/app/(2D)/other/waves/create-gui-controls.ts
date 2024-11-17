import { Waves } from '@/app/(2D)/other/waves/waves';
import { AnimationController } from '@/controllers/animation-controller';

export const createGuiControls = (
  animationController: AnimationController,
  waves: Waves,
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
        .add(waves, 'ghosting', {
          Off: 1,
          Low: 0.1,
          Medium: 0.06,
          High: 0.04,
        })
        .name('Ghosting').domElement.style.color = 'black';

      gui.addFolder('Waves');
      gui.add(waves, 'isAnimateColor').name('Color');
      gui.add(waves, 'isAnimateAmplitude').name('Amplitude');
      gui.add(waves, 'amplitude', -300, 300).name('Amplitude');
      gui.add(waves, 'waveLength', -0.1, 0.1, 0.01).name('Wave Length');
      gui.add(waves, 'frequency', -1, 1, 0.01).name('Frequency');
      gui.add(waves, 'hue', 0, 360).name('Hue');
      gui.add(waves, 'saturation', 0, 100).name('Saturation');
      gui.add(waves, 'lightness', 0, 100).name('Lightness');

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
