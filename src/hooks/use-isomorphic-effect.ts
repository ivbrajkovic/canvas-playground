import { useEffect, useLayoutEffect } from 'react';

/**
 * A custom hook that provides an isomorphic effect based on the environment.
 * If the code is running in a browser environment, it uses `useLayoutEffect`.
 * Otherwise, it uses `useEffect`.
 *
 * @returns The appropriate effect hook based on the environment.
 */
export const useIsomorphicEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
