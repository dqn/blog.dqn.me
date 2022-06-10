import type { Component } from "../types/Component.js";
import { E } from "./E.js";

type Props = {
  title: string;
};

export const Layout: Component<Props> = ({ title }, ...children) => {
  return E(
    "html",
    { lang: "ja" },
    E(
      "head",
      {},
      E("meta", { name: "viewport", content: "width=device-width" }),
      E("meta", { charset: "utf-8" }),
      E("meta", { name: "theme-color", content: "#665886" }),
      E("title", {}, title)
    ),
    E("body", {}, ...children)
  );
};
