import { readFile } from "node:fs/promises";
import path from "node:path";
import { h } from "../../../components/h.js";
import { Layout } from "../../../components/Layout.js";
import { entriesDir } from "../../../helpers/entriesDir.js";
import { listEntries } from "../../../helpers/listEntries.js";
import { markdown } from "../../../parser/markdown/markdown.js";
import { siteName } from "../../../siteName.js";
import type { Component } from "../../../types/Component.js";
import type { GenerateStaticParams } from "../../../types/GenerateStaticParams.js";

type Props = {
  id: string;
};

const Entry: Component<Props> = async ({ id }) => {
  const fileContent = await readFile(
    path.join(entriesDir, id + ".md"),
    "utf-8"
  );
  const result = markdown([...fileContent]);

  if (!result.success) {
    throw new Error("invalid markdown");
  }

  const { frontmatter, content } = result.data;

  const { title, date } = frontmatter;

  if (title === undefined || title === "") {
    throw new Error("title is required");
  }
  if (date === undefined || date === "") {
    throw new Error("date is required");
  }

  return Layout(
    { title: `${title} | ${siteName}`, ogType: "article" },
    h(
      "div",
      { class: "max-w-screen-md mx-auto" },
      h(
        "header",
        { class: "mt-12 mb-8 text-center" },
        h("h1", { class: "text-3xl font-bold" }, title),
        h("time", { class: "text-sm" }, date)
      ),
      h(
        "main",
        { class: "p-5 bg-white text-text" },
        h("p", { class: "whitespace-pre-wrap" }, content)
      )
    )
  );
};

export const generateStaticParams: GenerateStaticParams<Props> = async () => {
  const paths = await listEntries({ asPath: false });
  return paths.map((x) => ({ id: x.replace(".md", "") }));
};

export default Entry;
