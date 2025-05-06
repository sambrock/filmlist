export type GlobalStoreState = {
  clientId: string | null;
};

export type GlobalStoreActions = {
  initialize: (state: Partial<GlobalStoreState>) => void;
};

export type GlobalStore = GlobalStoreState & GlobalStoreActions;
