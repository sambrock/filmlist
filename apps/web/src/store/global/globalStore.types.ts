export type GlobalStoreState = {
  clientId: string | null;

  initialListId: string | null;

  isInitialized: boolean;
};

export type GlobalStoreActions = {
  update: (state: Partial<GlobalStoreState>) => void;
};

export type GlobalStore = GlobalStoreState & GlobalStoreActions;
