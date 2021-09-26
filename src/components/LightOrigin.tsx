import { FunctionComponent } from 'preact';

import { styled } from '@linaria/react';

import { LightOriginType } from '../store';
import { BaseElementWrapper } from './BaseElementWrapper';

export const LightOrigin: FunctionComponent<LightOriginType> = (props) => {
  return (
    <BaseElementWrapper {...props}>
      {(isDragging): JSX.Element => (
        <Button isDragged={isDragging}>{props.height}</Button>
      )}
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
  background-color: ${({ isDragged }): string => (isDragged ? '#f1f1f184s' : 'white')};
`;
