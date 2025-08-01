import { useRef } from 'react';

export const useLazyRef = <T>(initializer: () => T): React.MutableRefObject<T> => {
  const ref = useRef<T | null>(null);
  if (ref.current === null) ref.current = initializer();
  return ref as React.MutableRefObject<T>;
};
