import { GUI } from 'dat.gui';

export class DotGuiController {
  private gui: Promise<GUI>;

  constructor() {
    this.gui = import('dat.gui') //
      .then(async (dat) => {
        const gui = new dat.GUI();
        gui.domElement.style.marginTop = '64px';
        gui.domElement.style.marginRight = '0px';
        return gui;
      });
  }

  configureGUI = (configureGUI: (gui: GUI) => void) => {
    this.gui = this.gui.then((gui) => {
      configureGUI(gui);
      return gui;
    });
  };

  dispose = () => {
    this.gui.then((gui) => gui.destroy());
  };
}
