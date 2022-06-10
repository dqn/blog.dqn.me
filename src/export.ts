import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Element } from "./types/Element.js";

const baseDir = "dist/pages";
const outDir = "out";
const stylesDir = "src/styles";
const outStyleFilename = "style.css";

async function listFiles(dir: string): Promise<string[]> {
  const dirents = await readdir(dir, { withFileTypes: true });
  const tasks = dirents.map(async (dirent) => {
    const p = path.join(dir, dirent.name);
    return dirent.isFile() ? p : await listFiles(p);
  });

  return await Promise.all(tasks).then((xs) => xs.flat());
}

function generateHtml(element: null | Element): string {
  if (element === null) {
    return "";
  }

  const attributes = Object.entries(element.attributes ?? {}).map(
    ([name, value]) => (value === null ? `${name}` : `${name}="${value}"`)
  );

  let html = `<${element.tag}`;

  if (attributes.length > 0) {
    html += " " + attributes.join(" ");
  }

  if (element.children.length > 0) {
    html += ">";
    html += element.children
      .map((x) => (typeof x === "string" ? x : generateHtml(x)))
      .join("");
    html += `</${element.tag}>`;
  } else {
    html += " />";
  }

  return html;
}

async function main(): Promise<void> {
  const paths = await listFiles(baseDir).then((xs) =>
    xs.filter((x) => !path.basename(x).startsWith("_"))
  );

  type Page = {
    path: string;
    data: string;
  };

  const pages = await Promise.all(
    paths.map<Promise<Page[]>>(async (p) => {
      const module = await import(p.replace(/^dist/, "."));

      const normalizedPath = p.replace(baseDir, "");
      const matches = /\[([A-Za-z\-]+)\]/g.exec(normalizedPath);

      if (matches === null) {
        return [
          {
            path: normalizedPath,
            data: `<!DOCTYPE html>${generateHtml(module.default({}))}\n`,
          },
        ];
      }

      const paramNames = matches?.slice(1);

      if (module.getStaticPaths !== undefined) {
        const paramsList = await module.getStaticPaths();
        const propsList = await Promise.all(
          paramsList.map(async (params: any) => {
            const props = await module.getStaticProps(params);
            const path = paramNames?.reduce(
              (acc, name) => acc.replace(`[${name}]`, params[name]),
              normalizedPath
            );

            return { path, props };
          })
        );

        return propsList.map(({ path, props }) => ({
          path,
          data: `<!DOCTYPE html>${generateHtml(module.default(props))}\n`,
        }));
      }

      throw new Error("hoge");
    })
  ).then((xs) => xs.flat());

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir);

  await Promise.all([
    ...pages.map(async (page) => {
      const outPath = path.join(outDir, page.path.replace(/\..*/, ".html"));
      await mkdir(path.dirname(outPath), { recursive: true });
      await writeFile(outPath, page.data);
      console.log(outPath);
    }),
    listFiles(stylesDir).then((paths) =>
      Promise.all(paths.map((p) => readFile(p, "utf-8"))).then((xs) =>
        writeFile(path.join(outDir, outStyleFilename), xs.join("\n"))
      )
    ),
  ]);
}

await main();
