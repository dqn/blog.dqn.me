import type { Children, Element } from "../types/Element.js";

export function E(
  tag: Element["tag"],
  attributes?: Element["attributes"],
  ...children: Children
): Element {
  return { tag, attributes, children };
}
