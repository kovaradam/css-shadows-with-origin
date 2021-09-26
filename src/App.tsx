import { FunctionComponent } from 'preact';

import { styled } from '@linaria/react';
import { useAtom } from 'jotai';

import {
  LightOriginType,
  lightOriginAtom,
  PageObjectType,
  pageObjectAtom,
} from './store';
import { useLightOriginRef } from './useLightOrigin';

export const App: FunctionComponent = () => {
  const [lightOrigins] = useAtom(lightOriginAtom);
  const [pageObjects] = useAtom(pageObjectAtom);

  return (
    <>
      <p>css shadows with origin</p>

      {lightOrigins.map((origin) => (
        <LightOrigin {...origin} />
      ))}

      {pageObjects.map((pageObject) => (
        <PageObject {...pageObject} />
      ))}
    </>
  );
};

const LightOrigin: FunctionComponent<LightOriginType> = (props) => {
  const { height } = props;

  return (
    <>
      <LightWrapper style={createStyle(props)}>{height}</LightWrapper>
    </>
  );
};

const PageObject: FunctionComponent<PageObjectType> = (props) => {
  const { dimensions, height } = props;
  const elementRef = useLightOriginRef<HTMLSpanElement>();
  return (
    <>
      <PageObjectWrapper
        ref={elementRef}
        dimensions={dimensions}
        style={createStyle(props)}
      >
        {height}
      </PageObjectWrapper>
    </>
  );
};

const LightWrapper = styled.span`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px 1px #efef01;
`;

const PageObjectWrapper = styled.span<{ dimensions: number[] }>`
  border-radius: 5px;
  border: 1px solid pink;
  width: ${({ dimensions }): number => dimensions[0]}px;
  height: ${({ dimensions }): number => dimensions[1]}px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 3px 1px black;
`;

function createStyle(props: PageObjectType | LightOriginType): JSX.CSSProperties {
  const {
    position: [x, y],
  } = props;
  return { top: `${y}px`, left: `${x}px` };
}
