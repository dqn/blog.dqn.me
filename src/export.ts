import { readdir } from "node:fs/promises";
import path from "node:path";
import type { Element } from "./types/Element.js";

const baseDir = "dist/pages";

async function listFiles(dir: string): Promise<string[]> {
  const dirents = await readdir(dir, { withFileTypes: true });
  const tasks = dirents.map(async (dirent) => {
    const p = path.join(dir, dirent.name);
    return dirent.isFile() ? p : await listFiles(p);
  });

  return await Promise.all(tasks).then((xs) => xs.flat());
}

async function main(): Promise<void> {
  const paths = await listFiles(baseDir).then((xs) =>
    xs.filter((x) => !path.basename(x).startsWith("_"))
  );
  console.log(paths);

  const { App } = await import("./pages/_app.js");

  type Page = {
    path: string;
    data: null | Element;
  };

  const pages = await Promise.all(
    paths.map<Promise<Page>>(async (p) => {
      const x = await import(p.replace(/^dist/, "."));
      return { path: p.replace(baseDir, ""), data: App(x.default({})) };
    })
  );

  console.log(pages);
}

await main();
