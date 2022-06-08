import type { Attributes } from "./Attributes.js";

export type Children = (string | Element)[];

export type Element = {
  name: string;
  attributes?: undefined | Attributes;
  children: Children;
};
