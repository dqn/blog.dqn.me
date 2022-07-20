import { copyFile, mkdir, readdir, rm } from "node:fs/promises";
import path, { dirname } from "node:path";

const outDir = "out";
const whitelist = [".git", outDir];

async function listFiles(dir: string): Promise<string[]> {
  const dirents = await readdir(dir, { withFileTypes: true });
  const tasks = dirents.map(async (dirent) => {
    const p = path.join(dir, dirent.name);
    return dirent.isFile() ? p : await listFiles(p);
  });

  return await Promise.all(tasks).then((xs) => xs.flat());
}

async function main(): Promise<void> {
  const contents = await readdir("./");
  await Promise.all(
    contents
      .filter((x) => !whitelist.includes(x))
      .map((x) => rm(x, { recursive: true, force: true }))
  );
  await listFiles(outDir).then((paths) =>
    Promise.all(
      paths.map(async (p) => {
        const dest = p.replace(new RegExp(`^${outDir}/`), "");
        console.log(dirname(dest));
        if (dirname(dest) !== "") {
          await mkdir(dirname(dest), { recursive: true });
        }
        return copyFile(p, dest);
      })
    )
  );
  await rm(outDir, { recursive: true, force: true });
}

await main();
