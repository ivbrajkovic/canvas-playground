'use client';

import { useEffect, useState } from 'react';
// import * as dat from 'dat.gui';

import random from 'lodash/random';
import { Canvas } from '@/features/2D/classes/canvas';
import { BouncingBall } from '@/features/2D/bouncing-balls/bouncing-ball';
import { AnimationFrame } from '@/features/2D/classes/animation-frame';

const V_MIN = -3.0;
const V_MAX = 3.0;
const RADIUS_MIN = 15;
const RADIUS_MAX = 35;
const NUMBER_OF_BALLS = 20;

const settings = {
  vMin: -3.0,
  vMax: 3.0,
  radiusMin: 15,
  radiusMax: 35,
  numberOfBalls: 20,
};

const init = () => {
  const gui = (async () => {
    const dat = await import('dat.gui');
    const gui = new dat.GUI();
    gui.add(settings, 'vMin', -10, 10, 0.1);
    gui.add(settings, 'vMax', -10, 10, 0.1);
    gui.add(settings, 'radiusMin', 0, 100, 1);
    gui.add(settings, 'radiusMax', 0, 100, 1);
    gui.add(settings, 'numberOfBalls', 1, 100, 1);
    return gui;
  })();

  const destroy = () => {
    gui.then((gui) => {
      gui.destroy();
    });
  };

  return destroy;
};

const createBalls = (canvas: Canvas) =>
  Array.from({ length: NUMBER_OF_BALLS }, () => {
    const radius = random(RADIUS_MIN, RADIUS_MAX);
    const x = random(radius, canvas.width - radius);
    const y = random(radius, canvas.height - radius);
    const color = `hsl(${random(360, true)}, 50%, 50%)`;
    const vx = random(V_MIN, V_MAX, true);
    const vy = random(V_MIN, V_MAX, true);
    return new BouncingBall(x, y, radius, color, vx, vy);
  });

export const useBouncingBalls = () => {
  useEffect(() => {
    return init();
  }, []);

  useEffect(() => {
    const canvas = new Canvas();
    canvas.startResizeListener();

    const balls = createBalls(canvas);

    const animation = () => {
      canvas.context.fillStyle = 'rgba(0, 0, 0, 0.05)';
      canvas.context.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < balls.length; i++) {
        balls[i].update(canvas.context);
      }
    };

    const animationFrame = new AnimationFrame(animation);
    animationFrame.start();

    return () => {
      animationFrame.stop();
      canvas.stopResizeListener();
    };
  }, []);
};
