import { RefObject, useEffect, useState } from 'react';

/**
 * A custom hook that executes a factory function when the ref's current value is set.
 * @param ref  A React ref object
 * @param factory A function that takes the ref's current value and returns a new value
 * @returns The value returned by the factory function or null if the ref is not set
 */
export function useOnRef<T, U>(ref: RefObject<T>, factory: (el: T) => U): U | null {
  const [value, setValue] = useState<U | null>(() =>
    ref.current ? factory(ref.current) : null,
  );

  useEffect(() => {
    if (!ref.current || value) return;
    setValue(factory(ref.current));
  }, [ref, value, factory]);

  return value;
}
