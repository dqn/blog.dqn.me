import type { Element } from "../types/Element.js";

export function E(
  tag: Element["tag"],
  attributes?: Element["attributes"],
  ...children: Element["children"]
): Element {
  return { tag, attributes, children };
}
