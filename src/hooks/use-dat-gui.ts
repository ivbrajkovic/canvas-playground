import { GUI } from 'dat.gui';
import { useEffect, useState } from 'react';

export class DotGuiController {
  private gui: Promise<GUI> | null = null;

  init = (configureGUI: (gui: GUI) => void) => {
    this.gui = import('dat.gui') //
      .then((dat) => {
        const gui = new dat.GUI();
        gui.domElement.style.marginTop = '64px';
        gui.domElement.style.marginRight = '0px';
        configureGUI(gui);
        return gui;
      });
  };

  dispose = () => {
    this.gui?.then((gui) => gui.destroy());
  };
}

export const useDatGui = (configureGui: (gui: GUI) => void) => {
  const [dotGuiController] = useState(() => new DotGuiController());

  useEffect(() => {
    dotGuiController.init(configureGui);
    return dotGuiController.dispose;
  }, [dotGuiController, configureGui]);
};
