import { FunctionComponent } from 'preact';

import { FiPlus } from 'react-icons/fi';
import styled from 'styled-components';

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
        <S.Content dimensions={item.dimensions} isDragged={isDragging}>
          <S.CloseButton onClick={deleteItem}>
            <FiPlus />
          </S.CloseButton>
          {item.height}
        </S.Content>
      )}
    </BaseElementWrapper>
  );
};

const S = {
  Content: styled.button<{ dimensions: number[]; isDragged: boolean }>`
    border: 1px solid pink;
    width: ${({ dimensions }): number => dimensions[0]}px;
    height: ${({ dimensions }): number => dimensions[1]}px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ isDragged }): string => (isDragged ? '#f1f1f184' : 'white')};
    cursor: ${({ isDragged }): string => (isDragged ? 'grab' : 'pointer')};
  `,
  CloseButton: styled.button`
    position: absolute;
    top: 0;
    right: 0;
    margin: 2px;
    padding: 2px;
    border-radius: 3px;
    color: grey;

    &:hover {
      background-color: #e1e1e1;
    }

    & > svg {
      transform: rotate(45deg);
      vertical-align: middle;
    }
  `,
};
