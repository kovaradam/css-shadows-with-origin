import { LightOriginType, PageObjectType } from '../store';

export function createStyle(props: PageObjectType | LightOriginType): JSX.CSSProperties {
  const {
    position: [x, y],
  } = props;
  return {
    top: `${y}px`,
    left: `${x}px`,
    transform: `scale(${1 + props.height / 100})`,
  };
}
