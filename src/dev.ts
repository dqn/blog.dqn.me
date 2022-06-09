import fs from "node:fs/promises";
import { fork } from "node:child_process";

const targets = ["./dist/serve.js", "./dist/export.js"];

type StartReturns = {
  kill: () => Promise<void>;
};

function start(filename: string): StartReturns {
  const child = fork(filename);

  const task = new Promise<void>((resolve) => {
    child.once("exit", () => {
      child.removeAllListeners();
      resolve();
    });
  });

  return {
    kill: () => {
      child.kill("SIGTERM");
      return task;
    },
  };
}

async function dev(target: string): Promise<void> {
  let child = start(target);

  process.on("exit", () => {
    void child.kill();
  });

  const iterable = fs.watch("./dist", { recursive: true });

  for await (const _ of iterable) {
    await child.kill();
    child = start(target);
  }
}

async function main(): Promise<void> {
  await Promise.all(targets.map(dev));
}

await main();
