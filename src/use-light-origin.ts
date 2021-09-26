import { RefObject } from 'preact';

import { useEffect, useRef } from 'react';

import { addShadow } from './lib';

export function useLightOriginRef<T extends HTMLElement>(): RefObject<T> {
  const elementRef = useRef<T>(null);
  useLightOrigin(elementRef);

  return elementRef;
}

export function useLightOrigin<T extends HTMLElement>(elementRef: RefObject<T>): void {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }
    const unsub = addShadow(element);
    return unsub;
  }, [elementRef]);
}
