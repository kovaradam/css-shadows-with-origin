import { FunctionComponent } from 'preact';

import { lightOriginIdsSelector, pageObjectIdsSelector, useStore } from '../store';
import { ElementWithShadow } from './ElementWithShadow';
import { LightOrigin } from './LightOrigin';

export const App: FunctionComponent = () => {
  const [lightOrigins, pageObjects] = useStore((s) => [
    lightOriginIdsSelector(s),
    pageObjectIdsSelector(s),
  ]);

  return (
    <>
      <p>css shadows with origin</p>

      {pageObjects.map((id) => (
        <ElementWithShadow key={id} id={id} />
      ))}

      {lightOrigins.map((id) => (
        <LightOrigin key={id} id={id} />
      ))}
    </>
  );
};
