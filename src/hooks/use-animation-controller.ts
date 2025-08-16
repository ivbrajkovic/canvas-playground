'use client';

import { useEffect, useMemo, useRef } from 'react';

import {
  AnimationController,
  AnimationControllerOptions,
  FrameCallback,
} from '@/controllers/animation-controller2';

export function useAnimationController(
  frameCallback: FrameCallback,
  options: AnimationControllerOptions = {},
) {
  const controllerRef = useRef<AnimationController>(null);
  const frameCallbackRef = useRef(frameCallback);
  frameCallbackRef.current = frameCallback;

  useEffect(() => {
    const callback = (time: number) => frameCallbackRef.current(time);
    const controller = new AnimationController(callback, options);
    controllerRef.current = controller;
    return controller.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useMemo(
    () => ({
      start: () => {
        controllerRef.current?.start();
      },
      stop: () => {
        controllerRef.current?.stop();
      },
      toggle: (value: boolean) => {
        value ? controllerRef.current?.start() : controllerRef.current?.stop();
      },
    }),
    [],
  );
}
