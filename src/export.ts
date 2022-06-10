import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Element } from "./types/Element.js";

const baseDir = "dist/pages";
const outDir = "out";

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
    paths.map<Promise<Page>>(async (p) => {
      const x = await import(p.replace(/^dist/, "."));
      return {
        path: p.replace(baseDir, ""),
        data: `<!DOCTYPE html>${generateHtml(x.default({}))}\n`,
      };
    })
  );

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir);

  await Promise.all(
    pages.map(async (page) => {
      const outPath = path.join(outDir, page.path.replace(/\..*/, ".html"));
      await mkdir(path.dirname(outPath), { recursive: true });
      await writeFile(outPath, page.data);
      console.log(outPath);
    })
  );
}

await main();
