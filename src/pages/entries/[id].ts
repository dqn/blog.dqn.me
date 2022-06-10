import { readFile } from "node:fs/promises";
import path from "node:path";
import { E } from "../../components/E.js";
import { Layout } from "../../components/Layout.js";
import { entriesDir } from "../../helpers/entriesDir.js";
import { listEntries } from "../../helpers/listEntries.js";
import type { Component } from "../../types/Component.js";
import type { GetStaticPaths } from "../../types/GetStaticPaths.js";
import type { GetStaticProps } from "../../types/GetStaticProps.js";

type Props = {
  content: string;
};

const Entry: Component<Props> = ({ content }) => {
  return Layout({ title: "entry" }, E("div", {}, content));
};

type Params = {
  id: string;
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({ id }) => {
  const content = await readFile(path.join(entriesDir, id + ".md"), "utf-8");

  return {
    content,
  };
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const paths = await listEntries({ asPath: false });
  return paths.map((x) => ({ id: x.replace(".md", "") }));
};

export default Entry;
