import { readdir } from "node:fs/promises";
import path from "node:path";
import { entriesDir } from "./entriesDir.js";

type ListEntriesParams = {
  asPath: boolean;
};

export async function listEntries({
  asPath,
}: ListEntriesParams): Promise<string[]> {
  const entries = await readdir(entriesDir);

  if (!asPath) {
    return entries;
  }

  return entries.map((x) => path.join(entriesDir, x));
}
