import { FunctionComponent } from 'preact';

import { styled } from '@linaria/react';

import { useStoreItem } from '../store';
import { BaseElementWrapper } from './BaseElementWrapper';

export const LightOrigin: FunctionComponent<{ id: number }> = ({ id }) => {
  const { item } = useStoreItem(id);

  if (!item) {
    return null;
  }

  return (
    <BaseElementWrapper id={item.id}>
      {(isDragging): JSX.Element => <Button isDragged={isDragging}>{item.height}</Button>}
    </BaseElementWrapper>
  );
};

const Button = styled.button<{ isDragged: boolean }>`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px 1px #efef01;
  background-color: ${({ isDragged }): string => (isDragged ? '#ebebeb' : 'white')};
  cursor: ${({ isDragged }): string => (isDragged ? 'grab' : 'pointer')};
`;
