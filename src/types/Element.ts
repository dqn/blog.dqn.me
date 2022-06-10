import type { Attributes } from "./Attributes.js";

export type AppNode = null | string | Element;

export type Children = AppNode[];

export type Element = {
  tag: string;
  attributes?: undefined | Attributes;
  children: Children;
};
