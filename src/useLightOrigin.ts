import { RefObject } from 'preact';

import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';

import { lightOriginAtom, LightOriginType, Position } from './store';

export function useLightOriginRef<T extends HTMLElement>(): RefObject<T> {
  const elementRef = useRef<T>(null);
  useLightOrigin(elementRef);

  return elementRef;
}

export function useLightOrigin<T extends HTMLElement>(elementRef: RefObject<T>): void {
  const [lightOrigins] = useAtom(lightOriginAtom);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }
    const [color, blur, spread] = ['#0000001a', 5, 5];

    lightOrigins.forEach((origin) => {
      element.style.boxShadow = `${createShadowOffset(
        origin,
        element,
      )} ${blur}px ${spread}px ${color}`;
    });
  }, [elementRef, lightOrigins]);
}

function createShadowOffset(origin: LightOriginType, element: HTMLElement): string {
  const elementRect = element.getBoundingClientRect();
  const shadowDirection = getShadowDirection(origin, elementRect);

  return `${shadowDirection[0]}px ${shadowDirection[1]}px`;
}

type Direction = Position;

function getShadowDirection(origin: LightOriginType, elementRect: DOMRect): Direction {
  const { top, right, bottom, left } = elementRect;
  const [centerLeft, centerTop] = [left + (right - left) / 2, top + (bottom - top) / 2];
  const [originLeft, originTop] = origin.position;

  const [shadowBorderLeft, shadowBorderTop] = ((): Position => {
    if (originLeft <= centerLeft) {
      if (originTop <= centerTop) {
        return [right, bottom];
      } else {
        return [right, top];
      }
    } else {
      if (originTop <= centerTop) {
        return [left, bottom];
      } else {
        return [left, top];
      }
    }
  })();

  const elementHeight = 1;
  const heightDiff = origin.height >= elementHeight ? origin.height - elementHeight : 0;
  const [ratioLeft, ratioTop] = [
    (shadowBorderLeft - originLeft) / heightDiff,
    (shadowBorderTop - originTop) / heightDiff,
  ];

  const area: ReturnType<typeof getShadowDirection> = [
    ratioLeft * elementHeight,
    ratioTop * elementHeight,
  ];

  return area;
}
