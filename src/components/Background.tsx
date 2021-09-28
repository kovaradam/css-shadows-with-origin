import { FunctionComponent } from 'preact';

import { useRef } from 'preact/hooks';
import { useState } from 'react';
import styled from 'styled-components';

import { BaseItem, createStoreItem, Position, useStore } from '../store';
import { useDrag } from './utils';

export const Background: FunctionComponent = ({ children }) => {
  const [menuPosition, setMenuPosition] = useState<Position | null>();
  const setStoreState = useStore((s) => s.setState);
  const wrapperElement = useRef<HTMLDivElement>(null);
  const [newElementPosition, setNewElementPosition] = useState<Position | null>(null);
  const [newElementDimensions, setNewElementDimensions] = useState<Position | null>(null);

  const createMenu = (event: MouseEvent): void => {
    setMenuPosition((prev) => {
      if (prev) {
        return null;
      }
      return [event.clientX, event.clientY];
    });
  };

  const handleClick = (event: MouseEvent): void => {
    if (event.target !== wrapperElement.current) {
      return;
    }
    createMenu(event);
  };

  const createObject = (position: Position, dimensions?: Position): void => {
    if (newElementDimensions && newElementPosition) {
      const style = createDragAreaStyle(newElementPosition, newElementDimensions);
      position = [style.left, style.top];
      dimensions = [style.width, style.height];
    }
    setStoreState((prev) => {
      const newItem = createStoreItem({
        height: 0,
        position: position,
        dimensions,
      } as Omit<BaseItem, 'id'>);
      return { ...prev, items: prev.items.concat(newItem) };
    });
    setMenuPosition(null);
  };

  const onDragStart = (event: JSX.TargetedMouseEvent<HTMLDivElement>): void => {
    if (event?.target !== wrapperElement.current) {
      return;
    }
    setNewElementPosition([event.clientX, event.clientY]);
    setNewElementDimensions([0, 0]);
  };

  const onDragMove = (
    [widthDiff, heightDiff]: Position,
    event: JSX.TargetedMouseEvent<HTMLDivElement>,
  ): void => {
    if (event?.target !== wrapperElement.current) {
      return;
    }
    setNewElementDimensions((prev) => {
      if (!prev) {
        return null;
      }

      const [prevWidth, prevHeight] = prev;
      return [prevWidth + widthDiff, prevHeight + heightDiff];
    });
  };

  const onDragEnd = (event: MouseEvent): void => {
    if (!newElementPosition || !newElementDimensions) {
      return;
    }
    setNewElementDimensions(null);
    setNewElementPosition(null);
    if (newElementDimensions.filter((dimension) => Math.abs(dimension) > 20).length) {
      createObject(newElementPosition, newElementDimensions);
    } else {
      createMenu(event);
    }
  };

  const registerDrag = useDrag({
    onStart: onDragStart,
    onMove: onDragMove,
    onEnd: onDragEnd,
  });

  const createDragAreaStyle = (
    [left, top]: Position,
    [width, height]: Position,
  ): Record<'top' | 'left' | 'width' | 'height', number> => {
    const style = { top, left, width, height };
    if (width < 0) {
      style.left = left + width;
      style.width = -width;
    }
    if (height < 0) {
      style.top = top + height;
      style.height = -height;
    }

    return style;
  };

  return (
    <S.BackgroundWrapper ref={wrapperElement} onClick={handleClick} {...registerDrag}>
      {menuPosition && (
        <S.Menu style={{ top: menuPosition[1], left: menuPosition[0] }}>
          <S.MenuItem onClick={(): void => createObject(menuPosition)}>
            Create light origin
          </S.MenuItem>
          <S.MenuItem onClick={(): void => createObject(menuPosition, [30, 50])}>
            Create element
          </S.MenuItem>
        </S.Menu>
      )}
      {newElementPosition && newElementDimensions && (
        <S.DragArea
          style={createDragAreaStyle(newElementPosition, newElementDimensions)}
        />
      )}
      {children}
    </S.BackgroundWrapper>
  );
};

const S = {
  BackgroundWrapper: styled.div`
    width: 100%;
    height: 100%;
  `,
  Menu: styled.ul`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: baseline;
    flex-direction: column;
    transform-origin: top left;
    border-radius: 6px;
    box-shadow: 0px 0px 4px 0px #cdcdcd;
    background-color: white;
    overflow: hidden;
    margin: 0;
    padding: 0;
    list-style: none;
    animation: show 100ms ease-in;

    @keyframes show {
      from {
        transform: scale(0);
      }
      to {
        transform: scale(1);
      }
    }
  `,
  MenuItem: styled.li`
    text-decoration: none;
    padding: 0.5rem 1rem;
    padding-right: 2rem;
    width: 100%;
    box-sizing: border-box;

    &:hover {
      cursor: pointer;
      background-color: #f1f1f1;
    }
  `,
  DragArea: styled.span`
    background-color: #dceaff;
    border: 2px solid #9797f9;
    position: absolute;
  `,
};
