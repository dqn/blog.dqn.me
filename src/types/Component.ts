import type { Element } from "./Element.js";

export type Component<T = Record<string, never>> = (props: T) => null | Element;
