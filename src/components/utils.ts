import { useCallback, useRef } from 'preact/hooks';

import { LightOriginType, PageObjectType, Position } from '../store';

export function createStyle(props: PageObjectType | LightOriginType): JSX.CSSProperties {
  const {
    position: [x, y],
  } = props;
  return {
    top: `${y}px`,
    left: `${x}px`,
    transform: `scale(${1 + props.height / 100})`,
  };
}

export function useDrag<T extends HTMLElement>(params?: {
  onStart?: (event: JSX.TargetedMouseEvent<T>) => void;
  onMove: (positionDiff: Position, event: JSX.TargetedMouseEvent<T>) => void;
  onEnd?: (event: JSX.TargetedMouseEvent<T>) => void;
}): {
  onMouseDown: JSX.EventHandler<JSX.TargetedMouseEvent<T>>;
  onMouseMove: JSX.EventHandler<JSX.TargetedMouseEvent<T>>;
  onMouseUp: JSX.EventHandler<JSX.TargetedMouseEvent<T>>;
} {
  const persisted = useRef<{ start?: Position; isDragging?: boolean }>({});

  const onMouseDown = useCallback(
    (event: JSX.TargetedMouseEvent<T>) => {
      persisted.current.start = [event.clientX, event.clientY];
      persisted.current.isDragging = true;

      params?.onStart?.(event);
    },
    [params],
  );

  const onMouseMove = useCallback(
    (event: JSX.TargetedMouseEvent<T>) => {
      const { start, isDragging } = persisted.current;
      if (!isDragging || !start) {
        return;
      }
      const [left, top] = [event.clientX, event.clientY];
      const [startLeft, startTop] = start;
      const diff: Position = [left - startLeft, top - startTop];
      persisted.current.start = [left, top];
      params?.onMove(diff, event);
    },
    [params],
  );

  const onMouseUp = useCallback(
    (event: JSX.TargetedMouseEvent<T>) => {
      persisted.current = {};
      params?.onEnd?.(event);
    },
    [params],
  );

  return { onMouseDown, onMouseMove, onMouseUp };
}
