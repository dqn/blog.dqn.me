import { readdir, readFile } from "node:fs/promises";
import path from "path";
import { E } from "../components/E.js";
import { Layout } from "../components/Layout.js";
import { entriesDir } from "../helpers/entriesDir.js";
import { markdown } from "../parser/markdown/markdown.js";
import { siteName } from "../siteName.js";
import type { Component } from "../types/Component.js";
import type { GetStaticProps } from "../types/GetStaticProps.js";

type Entry = {
  title: string;
  date: string;
  path: string;
};

type Props = {
  entries: Entry[];
};

const Top: Component<Props> = ({ entries }) => {
  return Layout(
    { title: siteName },
    E(
      "ul",
      { class: "space-y-8 max-w-screen-md mx-auto" },
      ...entries.map(({ title, date, path }) =>
        E(
          "li",
          {},
          E(
            "div",
            { class: "flex flex-col" },
            E("time", { class: "text-sm" }, date),
            E("a", { href: path, class: "mt-2 text-white" }, title)
          )
        )
      )
    )
  );
};

export const getStaticProps: GetStaticProps<
  Props,
  Record<string, never>
> = async () => {
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

  return {
    entries: entries.sort((a, b) => b.date.localeCompare(a.date)),
  };
};

export default Top;
