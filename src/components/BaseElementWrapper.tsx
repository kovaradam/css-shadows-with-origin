import { styled } from '@linaria/react';
import { forwardRef } from 'preact/compat';
import { useCallback, useRef, useState } from 'preact/hooks';

import { Position, useStoreItem } from '../store';
import { createStyle } from './utils';

type Props = {
  id: number;
  className?: string;
  children: (isDragging: boolean) => JSX.Element;
};

export const BaseElementWrapper = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { setHeight, updateItem, item } = useStoreItem(props.id);
  const [isDragging, setIsDragging] = useState(false);

  const updateHeight = useCallback(
    (event: JSX.TargetedWheelEvent<HTMLDivElement>): void => {
      event.preventDefault();
      const heightUpdate = event.deltaY < 0 ? 1 : -1;
      setHeight(heightUpdate);
    },
    [setHeight],
  );

  const setPosition = useCallback(
    (position: Position): void => {
      if (!item) {
        return;
      }
      const [prevLeft, prevTop] = item.position;
      const [diffLeft, diffTop] = position;
      const newPosition: Position = [prevLeft + diffLeft, prevTop + diffTop];
      updateItem({ position: newPosition });
    },
    [updateItem, item],
  );

  const startDragging = useCallback(() => {
    setIsDragging(true);
  }, [setIsDragging]);

  const endDragging = useCallback(() => {
    setIsDragging(false);
  }, [setIsDragging]);

  const registerDrag = useDrag({
    onStart: startDragging,
    onMove: setPosition,
    onEnd: endDragging,
  });

  const style = ((): JSX.CSSProperties | undefined => {
    if (!item) {
      return;
    }
    return createStyle(item);
  })();

  return (
    <>
      <Wrapper
        id={String(props.id)}
        title={String(props.id)}
        className={props.className}
        style={style}
        onWheel={updateHeight}
        ref={ref}
        {...registerDrag}
      >
        {props.children(isDragging)}
      </Wrapper>
    </>
  );
});

const Wrapper = styled.div`
  position: absolute;
  border-radius: 5px;
`;

function useDrag<T extends HTMLElement>(params?: {
  onStart?: () => void;
  onMove: (positionDiff: Position) => void;
  onEnd?: () => void;
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

      params?.onStart?.();
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
      params?.onMove(diff);
    },
    [params],
  );

  const onMouseUp = useCallback(() => {
    persisted.current = {};
    params?.onEnd?.();
  }, [params]);

  return { onMouseDown, onMouseMove, onMouseUp };
}
