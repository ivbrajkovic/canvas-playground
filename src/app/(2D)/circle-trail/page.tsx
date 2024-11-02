'use client';

import { useCircleTrail } from '@/app/(2D)/circle-trail/use-circle-trail';

export default function Page() {
  useCircleTrail();

  return <canvas id="canvas" />;
}
