import { enableMapSet, enablePatches, Patch } from 'immer';

type StateSetter = (state: any) => void;

export type PatchesStoreState = {
  patches: [Patch[], Patch[], StateSetter][]; // [patches, inverse]
  pointer: number;
};

export type PatchesStoreActions = {
  undo: () => void;
  redo: () => void;
  pushPatches: (patches: Patch[], inversePatches: Patch[], set: StateSetter) => void;
};

export type PatchesStore = PatchesStoreState & PatchesStoreActions;
