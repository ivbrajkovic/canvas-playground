import { useImperativeHandle, useRef } from 'react';

const ONE_SECOND = 1000;

export type FpsTracker = {
  update: () => void;
};

type FpsTrackerProps = {
  ref?: React.Ref<FpsTracker>;
  intervalMs?: number;
};

export const FpsTracker = ({ ref, intervalMs = ONE_SECOND }: FpsTrackerProps) => {
  const fpsRef = useRef<HTMLDivElement>(null);
  const frameCountRef = useRef(0);
  const lastUpdateRef = useRef(0);

  useImperativeHandle(
    ref,
    () => ({
      update: () => {
        frameCountRef.current++;
        const now = performance.now();
        const elapsed = now - lastUpdateRef.current;

        if (elapsed < intervalMs) return;

        const fps = frameCountRef.current / (elapsed / 1000);
        frameCountRef.current = 0;
        lastUpdateRef.current = now;
        fpsRef.current!.textContent = `FPS: ${~~fps}`;
      },
    }),
    [intervalMs],
  );

  return (
    <div
      ref={fpsRef}
      className="absolute top-2 left-2 bg-black py-2 px-4 rounded text-white min-w-[100px] "
    >
      FPS: 0
    </div>
  );
};
