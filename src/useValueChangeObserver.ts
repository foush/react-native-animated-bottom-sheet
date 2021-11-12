import { useEffect, useRef } from 'react';

export default function useValueChangeObserver<T>(
  value: T,
  callback: (update: T) => void
) {
  const valueRef = useRef(value);
  useEffect(() => {
    if (valueRef.current === value) {
      return;
    }
    valueRef.current = value;
    callback(value);
  }, [value]);
  return valueRef.current;
}
