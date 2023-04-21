import type { AppNode, Children } from "./Element.js";

export type Component<T = Record<string, never>> = (
  attributes: T,
  ...children: Children
) => AppNode | Promise<AppNode>;
