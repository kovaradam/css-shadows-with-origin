import { FunctionComponent } from 'preact';

import { styled } from '@linaria/react';

import { PageObjectType, useStoreItem } from '../store';
import { useLightOriginRef } from '../use-light-origin';
import { BaseElementWrapper } from './BaseElementWrapper';

export const ElementWithShadow: FunctionComponent<{ id: number }> = ({ id }) => {
  const { item, deleteItem } = useStoreItem<PageObjectType>(id);
  const elementRef = useLightOriginRef<HTMLDivElement>();

  if (!item) {
    return null;
  }

  return (
    <BaseElementWrapper id={id} ref={elementRef}>
      {(isDragging): JSX.Element => (
        <Button
          dimensions={item.dimensions}
          isDragged={isDragging}
          onDblClick={deleteItem}
        >
          {item.height}
        </Button>
      )}
    </BaseElementWrapper>
  );
};

const Button = styled.button<{ dimensions: number[]; isDragged: boolean }>`
  border: 1px solid pink;
  width: ${({ dimensions }): number => dimensions[0]}px;
  height: ${({ dimensions }): number => dimensions[1]}px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ isDragged }): string => (isDragged ? '#f1f1f184s' : 'white')};
  cursor: ${({ isDragged }): string => (isDragged ? 'grab' : 'pointer')};
`;
