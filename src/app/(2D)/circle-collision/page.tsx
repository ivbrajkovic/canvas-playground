'use client';

import { useCircleCollision } from '@/app/(2D)/circle-collision/use-circle-collision';

const CircleCollision = () => {
  useCircleCollision();
  return <canvas id="canvas" />;
};

export default CircleCollision;
