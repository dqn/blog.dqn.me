import { E } from "../components/E.js";
import type { Component } from "../types/Component.js";

const Top: Component = () => {
  return E("h1", {}, "Hello World!");
};

export default Top;
