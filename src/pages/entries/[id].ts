import { readFile } from "node:fs/promises";
import path from "node:path";
import { E } from "../../components/E.js";
import { Layout } from "../../components/Layout.js";
import { entriesDir } from "../../helpers/entriesDir.js";
import { listEntries } from "../../helpers/listEntries.js";
import { markdown } from "../../parser/markdown/markdown.js";
import { siteName } from "../../siteName.js";
import type { Component } from "../../types/Component.js";
import type { GetStaticPaths } from "../../types/GetStaticPaths.js";
import type { GetStaticProps } from "../../types/GetStaticProps.js";

type Props = {
  title: string;
  date: string;
  content: string;
};

const Entry: Component<Props> = ({ title, date, content }) => {
  return Layout(
    { title: `${title} | ${siteName}` },
    E(
      "div",
      { class: "max-w-screen-md mx-auto" },
      E(
        "header",
        { class: "mt-12 mb-8 text-center" },
        E("h1", { class: "text-3xl font-bold" }, title),
        E("time", { class: "text-sm" }, date)
      ),
      E(
        "main",
        { class: "p-5 bg-white text-text" },
        E("p", { class: "whitespace-pre-wrap" }, content)
      )
    )
  );
};

type Params = {
  id: string;
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({ id }) => {
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

  return {
    title,
    date,
    content,
  };
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const paths = await listEntries({ asPath: false });
  return paths.map((x) => ({ id: x.replace(".md", "") }));
};

export default Entry;
