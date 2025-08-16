import { useRef } from 'react';

export const useLazyRef = <T>(initializer: () => T): React.RefObject<T> => {
  const ref = useRef<T | null>(null);
  if (ref.current === null) ref.current = initializer();
  return ref as React.RefObject<T>;
};
