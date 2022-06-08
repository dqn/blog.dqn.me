import type { Element } from "../types/Element.js";

export function E(
  name: Element["name"],
  attributes?: Element["attributes"],
  ...children: Element["children"]
): Element {
  return { name, attributes, children };
}
