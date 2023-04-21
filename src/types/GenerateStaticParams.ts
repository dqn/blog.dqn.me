export type GenerateStaticParams<T extends Record<string, string>> =
  () => Promise<T[]>;
