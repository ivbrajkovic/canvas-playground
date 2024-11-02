'use client';

import { useCircleOutline } from '@/app/(2D)/circle-outline/use-circle-outline';

export default function Page() {
  useCircleOutline();

  return <canvas id="canvas" />;
}
