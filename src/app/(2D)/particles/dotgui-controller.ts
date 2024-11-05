import { GUI } from 'dat.gui';

export class GuiControls {
  #guiControls: Promise<GUI>;

  constructor() {
    this.#guiControls = import('dat.gui')
      .then((dat) => new dat.GUI())
      .then((gui) => {
        gui.domElement.style.marginTop = '64px';
        gui.domElement.style.marginRight = '0px';
        return gui;
      });
  }

  add = (setupGui: (gui: GUI) => void) => {
    this.#guiControls = this.#guiControls.then((gui) => {
      setupGui(gui);
      return gui;
    });
    return this;
  };

  dispose = () => {
    this.#guiControls.then((gui) => gui.destroy());
  };
}
