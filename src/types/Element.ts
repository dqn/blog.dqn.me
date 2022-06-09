import type { Attributes } from "./Attributes.js";

export type Children = (string | Element)[];

export type Element = {
  tag: string;
  attributes?: undefined | Attributes;
  children: Children;
};
