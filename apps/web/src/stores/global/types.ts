export type GlobalStore = {
  lists: Map<
    string,
    {
      list: unknown;
      movies: unknown[];
    }
  >;
};
