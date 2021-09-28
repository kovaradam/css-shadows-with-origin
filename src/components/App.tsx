import { FunctionComponent } from 'preact';

import { setOrigins } from '../lib';
import {
  lightOriginIdsSelector,
  lightOriginsSelector,
  pageObjectIdsSelector,
  useStore,
} from '../store';
import { Background } from './Background';
import { ElementWithShadow } from './ElementWithShadow';
import { LightOrigin } from './LightOrigin';

export const App: FunctionComponent = () => {
  const [lightOrigins, pageObjects] = useStore((s) => [
    lightOriginIdsSelector(s),
    pageObjectIdsSelector(s),
  ]);

  return (
    <Background>
      <p>css shadows with origin</p>

      {pageObjects.map((id) => (
        <ElementWithShadow key={id} id={id} />
      ))}

      {lightOrigins.map((id) => (
        <LightOrigin key={id} id={id} />
      ))}
    </Background>
  );
};

useStore.subscribe(setOrigins, lightOriginsSelector);
