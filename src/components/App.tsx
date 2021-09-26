import { FunctionComponent } from 'preact';

import { lightOriginsSelector, pageObjectsSelector, useStore } from '../store';
import { ElementWithShadow } from './ElementWithShadow';
import { LightOrigin } from './LightOrigin';

export const App: FunctionComponent = () => {
  const [lightOrigins, pageObjects] = useStore((s) => [
    lightOriginsSelector(s),
    pageObjectsSelector(s),
  ]);

  return (
    <>
      <p>css shadows with origin</p>

      {lightOrigins.map((origin) => (
        <LightOrigin {...origin} />
      ))}

      {pageObjects.map((pageObject) => (
        <ElementWithShadow {...pageObject} />
      ))}
    </>
  );
};
