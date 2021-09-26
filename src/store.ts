import { atom } from 'jotai';

export type Position = [x: number, y: number];

type BaseElementProps = {
  position: Position;
  height: number;
};

export type LightOriginType = BaseElementProps;

const defaultOriginValue: LightOriginType = {
  position: [50, 50],
  height: 50,
};

export const lightOriginAtom = atom<LightOriginType[]>([defaultOriginValue]);

export type PageObjectType = BaseElementProps & {
  dimensions: [width: number, height: number];
};

const defaultPageObjectValue: PageObjectType[] = [
  {
    position: [250, 250],
    dimensions: [100, 100],
    height: 10,
  },
  {
    position: [400, 150],
    dimensions: [100, 60],
    height: 80,
  },
];

export const pageObjectAtom = atom<PageObjectType[]>(defaultPageObjectValue);
