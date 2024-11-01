'use client';

import { useCircleOutline } from '@/features/2D/circle-outline/use-circle-outline';

export default function Page() {
  useCircleOutline();

  return <canvas id='canvas' />;
}
