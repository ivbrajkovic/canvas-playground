import { RefObject, useEffect, useState } from 'react';

type ContextMap = {
  '2d': CanvasRenderingContext2D;
  webgl: WebGLRenderingContext;
  webgl2: WebGL2RenderingContext;
  bitmaprenderer: ImageBitmapRenderingContext;
};

type ContextId = keyof ContextMap;

export function useOnCanvas<T, Id extends ContextId = '2d'>(
  canvasRef: RefObject<HTMLCanvasElement>,
  factory: (el: HTMLCanvasElement, ctx: ContextMap[Id]) => T,
  contextId: Id = '2d' as Id,
): T | null {
  type Ctx = ContextMap[Id];

  const [value, setValue] = useState<T | null>(() => {
    const el = canvasRef.current;
    if (!el) return null;

    const ctx = el.getContext(contextId);
    return ctx ? factory(el, ctx as Ctx) : null;
  });

  useEffect(() => {
    const el = canvasRef.current;
    if (!el || value) return;

    const ctx = el.getContext(contextId);
    if (ctx) setValue(factory(el, ctx as Ctx));
  }, [canvasRef, factory, value, contextId]);

  return value;
}
