import { E } from "../components/E.js";
import type { Component } from "../types/Component.js";
import type { Children } from "../types/Element.js";

type Props = {
  children: Children;
};

export const App: Component<Props> = ({ children }) => {
  return E(
    "html",
    { lang: "ja" },
    E(
      "head",
      {},
      E("meta", { name: "viewport", content: "width=device-width" }),
      E("meta", { charset: "utf-8" }),
      E("meta", { name: "theme-color", content: "#665886" }),
      E("title", {}, "dqn.me")
    ),
    E("body", {}, ...children)
  );
};
