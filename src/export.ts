import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Component } from "./types/Component.js";
import type { AppNode } from "./types/Element.js";
import type { GetStaticPaths } from "./types/GetStaticPaths.js";
import type { GetStaticProps } from "./types/GetStaticProps.js";

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

function generateHtml(element: AppNode): string {
  if (element === null) {
    return "";
  }

  if (typeof element === "string") {
    return element;
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
    paths.map(async (p): Promise<Page[]> => {
      type Params = Record<string, unknown>;
      type Module = {
        default?: Component<Params>;
        getStaticPaths?: GetStaticPaths<Record<string, string>>;
        getStaticProps?: GetStaticProps<Params, Record<string, string>>;
      };
      const {
        default: renderer,
        getStaticProps,
        getStaticPaths,
      }: Module = await import(p.replace(/^dist/, "."));

      if (renderer === undefined) {
        throw new Error(`${p} does not have default export`);
      }

      const normalizedPath = p.replace(baseDir, "");
      const matches = /\[([A-Za-z\-]+)\]/g.exec(normalizedPath);

      const generateData = (params: Params) =>
        "<!DOCTYPE html>" + generateHtml(renderer(params)) + "\n";

      if (matches === null) {
        // no dinamic routes

        const params = (await getStaticProps?.({})) ?? {};
        return [
          {
            path: normalizedPath,
            data: generateData(params),
          },
        ];
      }

      if (getStaticPaths !== undefined) {
        // dynamic routes
        if (getStaticProps === undefined) {
          throw new Error(
            `${p} has getStaticPaths but not have getStaticProps`
          );
        }

        const paramsList = await getStaticPaths();

        return await Promise.all(
          paramsList.map(async (params): Promise<Page> => {
            const props = await getStaticProps(params);

            const paramNames = matches.slice(1);
            const path = paramNames.reduce((acc, name) => {
              const param = params[name];

              if (param === undefined) {
                throw new Error(
                  `${p}'s getStaticProps not returns param named '${name}'`
                );
              }

              return acc.replace(`[${name}]`, param);
            }, normalizedPath);

            return {
              path,
              data: generateData(props),
            };
          })
        );
      }

      throw new Error(`${p} is dynamic path but does not have getStaticPaths`);
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
