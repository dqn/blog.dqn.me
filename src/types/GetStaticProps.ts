export type GetStaticProps<
  T extends Record<string, unknown>,
  U extends Record<string, string>
> = (params: U) => Promise<T>;
