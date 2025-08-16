import { useCallback, useRef, useState } from 'react';

type ContextMap = {
  '2d': CanvasRenderingContext2D;
  webgl: WebGLRenderingContext;
  webgl2: WebGL2RenderingContext;
  bitmaprenderer: ImageBitmapRenderingContext;
};

type UseCanvasReturn<ContextId extends keyof ContextMap> = {
  canvasRefCallback: (canvas: HTMLCanvasElement | null) => void;
} & (
  | {
      isCanvasMounted: true;
      canvas: HTMLCanvasElement;
      context: ContextMap[ContextId];
    }
  | {
      isCanvasMounted: false;
      canvas: null;
      context: null;
    }
);

export const useCanvas = <ContextId extends keyof ContextMap = '2d'>(
  contextId: ContextId = '2d' as ContextId,
): UseCanvasReturn<ContextId> => {
  type Ctx = ContextMap[ContextId];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<Ctx | null>(null);
  const [isCanvasMounted, setIsMounted] = useState(false);

  const canvasRefCallback = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      if (!canvas || canvasRef.current) return;

      const context = canvas.getContext(contextId);
      if (!context) throw new Error('Canvas context not found');

      canvasRef.current = canvas;
      contextRef.current = context as Ctx;
      setIsMounted(true);
    },
    [contextId],
  );

  return {
    canvasRefCallback,
    isCanvasMounted,
    canvas: canvasRef.current,
    context: contextRef.current,
  } as UseCanvasReturn<ContextId>;
};
