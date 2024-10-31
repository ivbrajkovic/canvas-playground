'use client';

import { useBouncingBalls } from '@/features/2D/bouncing-balls/use-bouncing-balls';

export default function Page() {
  useBouncingBalls();

  return <canvas id='canvas' />;
}
