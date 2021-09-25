import { atom } from 'jotai';

type LightOrigin = {
  position: [x: number, y: number];
  height: number;
};

const defaultValue: LightOrigin = {
  position: [50, 50],
  height: 5,
};

export const lightOriginAtom = atom<LightOrigin[]>([defaultValue]);
