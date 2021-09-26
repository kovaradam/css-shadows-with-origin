import { useCallback } from 'preact/hooks';
import create, { SetState } from 'zustand';

export type Position = [x: number, y: number];

export type BaseElementProps = {
  position: Position;
  height: number;
  id: number;
};

export type LightOriginType = BaseElementProps;

const idGenerator = (function* (): Generator<number> {
  for (let i = 0; true; i++) {
    yield i;
  }
})();

function createId(): number {
  return idGenerator.next().value;
}

const defaultOriginValue: LightOriginType[] = [
  {
    position: [50, 50],
    height: 50,
    id: createId(),
  },
];

export type PageObjectType = BaseElementProps & {
  dimensions: [width: number, height: number];
};

const defaultPageObjectValue: PageObjectType[] = [
  {
    position: [250, 250],
    dimensions: [100, 100],
    height: 10,
    id: createId(),
  },
  {
    position: [400, 150],
    dimensions: [100, 60],
    height: 80,
    id: createId(),
  },
];

type Store = {
  items: (LightOriginType | PageObjectType)[];
  setState: SetState<Store>;
};

export const useStore = create<Store>((set) => ({
  items: [...defaultOriginValue, ...defaultPageObjectValue],
  setState: set,
}));

export function useStoreItem(id: number): {
  setHeight: (heightUpdate: number) => void;
  updateItem: (update: Partial<BaseElementProps>) => void;
  deleteItem: () => void;
} {
  const setState = useStore((s) => s.setState);

  const updateStoreWithItem = useCallback(
    (item: BaseElementProps, state: Store): Store => {
      const newItems = state.items.filter((origin) => origin.id !== id).concat(item);
      return { ...state, items: newItems };
    },
    [id],
  );

  const getItem = useCallback(
    (state: Store): BaseElementProps | null => {
      const item = state.items.find((origin) => origin.id === id);
      return item ?? null;
    },
    [id],
  );

  const setHeight = useCallback(
    (heightUpdate: number): void => {
      setState((prev) => {
        const item = getItem(prev);
        if (!item) {
          return prev;
        }

        const newHeight = item.height + heightUpdate;
        item.height = newHeight * +(newHeight >= 0);

        return updateStoreWithItem(item, prev);
      });
    },
    [getItem, updateStoreWithItem, setState],
  );

  const updateItem = useCallback(
    (update: Partial<BaseElementProps>): void => {
      setState((prev) => {
        let item = getItem(prev);
        if (!item) {
          return prev;
        }

        item = { ...item, ...update };

        return updateStoreWithItem(item, prev);
      });
    },
    [getItem, updateStoreWithItem, setState],
  );

  const deleteItem = useCallback((): void => {
    setState((prev) => {
      const newOrigins = prev.items.filter((item) => item.id !== id);
      return { ...prev, items: newOrigins };
    });
  }, [setState, id]);

  return { setHeight, deleteItem, updateItem };
}

function isLightOrigin(item: LightOriginType | PageObjectType): boolean {
  return (item as PageObjectType).dimensions === undefined;
}

export function lightOriginsSelector(state: Store): LightOriginType[] {
  return state.items.filter(isLightOrigin);
}

export function pageObjectsSelector(state: Store): PageObjectType[] {
  return state.items.filter((item) => !isLightOrigin(item)) as PageObjectType[];
}
