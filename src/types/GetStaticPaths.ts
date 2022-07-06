export type GetStaticPaths<T extends Record<string, string>> = () => Promise<
  T[]
>;
