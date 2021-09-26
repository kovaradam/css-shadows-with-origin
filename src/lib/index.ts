import { LightOriginType } from '../store';
import { createShadowOffset } from '../use-light-origin';

type OriginUpdater = (origin: LightOriginType[]) => LightOriginType[];

class Store {
  static lightOrigins: LightOriginType[] = [];
  static listeners: HTMLElement[] = [];

  private static update = (): void => {
    Store.listeners.forEach(Store.updateElement);
  };

  private static updateElement(element: HTMLElement): void {
    const [color, blur, spread] = ['#0000001a', 5, 5];

    Store.lightOrigins.forEach((origin) => {
      element.style.boxShadow = `${createShadowOffset(
        origin,
        element,
      )} ${blur}px ${spread}px ${color}`;
    });
  }

  public static subscribe(element: HTMLElement): () => void {
    Store.listeners.push(element);
    Store.updateElement(element);
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

export const addShadow: typeof Store.subscribe = (element) => {
  return Store.subscribe(element);
};

export const setOrigins: typeof Store.setOrigins = (origins) => {
  return Store.setOrigins(origins);
};
