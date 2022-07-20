import { E } from "../components/E.js";
import { Layout } from "../components/Layout.js";
import { siteName } from "../siteName.js";
import type { Component } from "../types/Component.js";

const Top: Component = () => {
  return Layout({ title: siteName }, E("h1", {}, "Hello World!"));
};

export default Top;
