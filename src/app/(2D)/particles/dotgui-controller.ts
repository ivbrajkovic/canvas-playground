import { GUI } from 'dat.gui';

export class GuiControls {
  #guiControls: Promise<GUI>;

  // constructor(configureGUI: (gui: GUI) => void) {
  //   this.guiControls = import('dat.gui') //
  //     .then(async (dat) => {
  //       const gui = new dat.GUI();
  //       gui.domElement.style.marginTop = '64px';
  //       gui.domElement.style.marginRight = '0px';
  //       configureGUI(gui);
  //       return gui;
  //     });
  // }

  constructor() {
    this.#guiControls = import('dat.gui') //
      .then((dat) => new dat.GUI());
  }

  add = (configureGUI: (gui: GUI) => void) => {
    this.#guiControls = this.#guiControls.then((gui) => {
      configureGUI(gui);
      return gui;
    });
    return this;
  };

  dispose = () => {
    this.#guiControls.then((gui) => gui.destroy());
  };
}
