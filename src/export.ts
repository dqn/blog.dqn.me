import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import path, { basename } from "node:path";
import type { Component } from "./types/Component.js";
import type { AppNode } from "./types/Element.js";
import type { GenerateStaticParams } from "./types/GenerateStaticParams.js";

const baseDir = "dist/app";
const outDir = "docs";
const publicDir = "public";
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
    xs
      .filter((x) => !path.basename(x).startsWith("_"))
      .filter((x) => x.endsWith("/index.js"))
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
        generateStaticParams?: GenerateStaticParams<Record<string, string>>;
      };
      const { default: renderer, generateStaticParams }: Module = await import(
        p.replace(/^dist/, ".")
      );

      if (renderer === undefined) {
        throw new Error(`${p} does not have default export`);
      }

      const normalizedPath = p.replace(baseDir, "");
      const matches = /\[([A-Za-z\-]+)\]/g.exec(normalizedPath);

      const generateData = async (params: Params) =>
        "<!DOCTYPE html>" + generateHtml(await renderer(params)) + "\n";

      if (matches === null) {
        // no dinamic routes

        return [
          {
            path: normalizedPath,
            data: await generateData({}),
          },
        ];
      }

      if (generateStaticParams !== undefined) {
        // dynamic routes

        const paramsList = await generateStaticParams();

        return await Promise.all(
          paramsList.map(async (params): Promise<Page> => {
            const paramNames = matches.slice(1);
            const path = paramNames.reduce((acc, name) => {
              const param = params[name];

              if (param === undefined) {
                throw new Error(
                  `${p}'s generateStaticParams not returns param named '${name}'`
                );
              }

              return acc.replace(`[${name}]`, param);
            }, normalizedPath);

            return {
              path,
              data: await generateData(params),
            };
          })
        );
      }

      throw new Error(
        `${p} is dynamic path but does not have generateStaticParams`
      );
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
    listFiles(publicDir).then((paths) =>
      Promise.all(paths.map((p) => copyFile(p, path.join(outDir, basename(p)))))
    ),
    writeFile(path.join(outDir, "CNAME"), "blog.dqn.me"),
  ]);
}

await main();
