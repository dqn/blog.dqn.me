import { E } from "../components/E.js";
import { Layout } from "../components/Layout.js";
import type { Component } from "../types/Component.js";

const Top: Component = () => {
  return Layout({ title: "blog.dqn.me" }, E("h1", {}, "Hello World!"));
};

export default Top;
