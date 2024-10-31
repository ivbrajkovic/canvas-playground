import { GUI } from 'dat.gui';
import { useEffect, useRef } from 'react';

export const useDatGui = (init: (gui: GUI) => void) => {
  const initRef = useRef(init);

  useEffect(() => {
    initRef.current = init;
  }, [init]);

  useEffect(() => {
    const gui = (async () => {
      const dat = await import('dat.gui');
      const gui = new dat.GUI();
      gui.domElement.style.marginTop = '64px';
      gui.domElement.style.marginRight = '0px';
      initRef.current(gui);
      return gui;
    })();

    return () => {
      gui.then((gui) => gui.destroy());
    };
  }, []);
};
