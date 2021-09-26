import { FunctionComponent } from 'preact';

import { styled } from '@linaria/react';

import { PageObjectType, useStoreItem } from '../store';
import { useLightOriginRef } from '../use-light-origin';
import { BaseElementWrapper } from './BaseElementWrapper';

export const ElementWithShadow: FunctionComponent<PageObjectType> = (props) => {
  const { dimensions, height, id } = props;
  const elementRef = useLightOriginRef<HTMLButtonElement>();

  const { deleteItem } = useStoreItem(id);

  return (
    <BaseElementWrapper {...props}>
      {(isDragging): JSX.Element => (
        <Button ref={elementRef} dimensions={dimensions} isDragged={isDragging}>
          {height}
        </Button>
      )}
    </BaseElementWrapper>
  );
};

const Button = styled.button<{ dimensions: number[]; isDragged: boolean }>`
  border-radius: 5px;
  border: 1px solid pink;
  width: ${({ dimensions }): number => dimensions[0]}px;
  height: ${({ dimensions }): number => dimensions[1]}px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ isDragged }): string => (isDragged ? '#f1f1f184s' : 'white')};
`;
