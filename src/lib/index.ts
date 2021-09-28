import { LightOriginType, Position } from '../store';

type OriginUpdater = (origin: LightOriginType[]) => LightOriginType[];

export const addShadow: typeof Store.subscribe = (element) => {
  return Store.subscribe(element);
};

export const setOrigins: typeof Store.setOrigins = (origins) => {
  return Store.setOrigins(origins);
};

function createShadow(
  origin: LightOriginType,
  element: HTMLElement,
  shadowProps?: { blur: number; spread: number; color: string },
): string {
  shadowProps ??= { color: '#0000001a', blur: 5, spread: 5 };
  return `${createShadowOffset(origin, element)} ${shadowProps.blur}px ${
    shadowProps.spread
  }px ${shadowProps.color}`;
}

class Store {
  static lightOrigins: LightOriginType[] = [];
  static listeners: HTMLElement[] = [];
  static observer: MutationObserver;

  private static update = (): void => {
    Store.listeners.forEach(Store.updateElement);
  };

  private static updateElement(element: HTMLElement): void {
    const shadow = Store.lightOrigins
      .map((origin) => createShadow(origin, element))
      .reduce((prev, current) => `${prev}, ${current}`);
    element.style.boxShadow = shadow;
  }

  private static observeElement = (element: HTMLElement): void => {
    if (!Store.observer) {
      Store.observer = new MutationObserver((mutation) => {
        mutation.forEach((mutationRecord) => {
          const element = mutationRecord.target as HTMLElement;
          Store.updateElement(element);
        });
      });
    }

    Store.observer.observe(element, { attributes: true });
  };

  public static subscribe(element: HTMLElement): () => void {
    Store.listeners.push(element);
    Store.updateElement(element);
    Store.observeElement(element);

    return (): void => {
      Store.listeners = Store.listeners.filter(
        (storeElement) => storeElement !== element,
      );
    };
  }

  public static setOrigins = (origins: LightOriginType[] | OriginUpdater): void => {
    if (typeof origins === 'function') {
      Store.lightOrigins = origins(Store.lightOrigins);
    } else {
      Store.lightOrigins = origins;
    }
    Store.update();
  };
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
