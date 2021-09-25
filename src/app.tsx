import { useAtom } from 'jotai';
import { FunctionComponent } from 'preact';
import { lightOriginAtom } from './store';

export const App: FunctionComponent = () => {
  const lightOrigins = useAtom(lightOriginAtom);
  return <p>css shadows with origin</p>;
};
