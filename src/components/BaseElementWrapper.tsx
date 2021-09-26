import { styled } from '@linaria/react';
import { useCallback, useRef, useState } from 'preact/hooks';

import { BaseElementProps, Position, useStoreItem } from '../store';
import { createStyle } from './utils';

type Props = BaseElementProps & {
  className?: string;
  children: (isDragging: boolean) => JSX.Element;
};

export function BaseElementWrapper(props: Props): JSX.Element {
  const { setHeight, updateItem } = useStoreItem(props.id);
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
      const [prevLeft, prevTop] = props.position;
      const [diffLeft, diffTop] = position;
      const newPosition: Position = [prevLeft + diffLeft, prevTop + diffTop];
      updateItem({ position: newPosition });
    },
    [updateItem, props.position],
  );

  const registerDrag = useDrag({
    onStart: () => setIsDragging(true),
    onMove: setPosition,
    onEnd: () => setIsDragging(false),
  });

  return (
    <>
      <Wrapper
        className={props.className}
        style={createStyle(props)}
        onWheel={updateHeight}
        {...registerDrag}
      >
        {props.children(isDragging)}
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  position: absolute;
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

  const onMouseUp = useCallback(
    (event: JSX.TargetedMouseEvent<T>) => {
      persisted.current = { isDragging: false };
      params?.onEnd?.();
    },
    [params],
  );

  return { onMouseDown, onMouseMove, onMouseUp };
}
