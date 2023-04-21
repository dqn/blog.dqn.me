import { readdir, readFile } from "node:fs/promises";
import path from "path";
import { h } from "../components/h.js";
import { Layout } from "../components/Layout.js";
import { entriesDir } from "../helpers/entriesDir.js";
import { markdown } from "../parser/markdown/markdown.js";
import { siteName } from "../siteName.js";
import type { Component } from "../types/Component.js";

type Entry = {
  title: string;
  date: string;
  path: string;
};

type Props = {
  entries: Entry[];
};

const Top: Component<Props> = async () => {
  const paths = await readdir(entriesDir);

  const entries = await Promise.all(
    paths.map(async (p): Promise<Entry> => {
      const fileContent = await readFile(path.join(entriesDir, p), "utf-8");
      const result = markdown([...fileContent]);

      if (!result.success) {
        throw new Error("invalid markdown");
      }

      const { title, date } = result.data.frontmatter;

      if (title === undefined || title === "") {
        throw new Error("title is required");
      }
      if (date === undefined || date === "") {
        throw new Error("date is required");
      }

      return {
        title,
        date,
        path: path.join("/entries", p).replace(/.md$/, ""),
      };
    })
  );

  entries.sort((a, b) => b.date.localeCompare(a.date));

  return Layout(
    { title: siteName, ogType: "website" },
    h(
      "ul",
      { class: "space-y-8 max-w-screen-md mx-auto" },
      ...entries.map(({ title, date, path }) =>
        h(
          "li",
          {},
          h(
            "div",
            { class: "flex flex-col" },
            h("time", { class: "text-sm" }, date),
            h("a", { href: path, class: "mt-2 text-white" }, title)
          )
        )
      )
    )
  );
};

export default Top;
