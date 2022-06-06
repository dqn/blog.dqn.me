import fs from "node:fs/promises";
import { fork } from "node:child_process";

const filename = "./dist/main.js";

type StartReturns = {
  kill: () => Promise<void>;
};

function start(filename: string): StartReturns {
  const child = fork(filename);

  return {
    kill: () => {
      const task = new Promise<void>((resolve) => {
        child.once("exit", () => {
          child.removeAllListeners();
          resolve();
        });
      });

      child.kill("SIGTERM");

      return task;
    },
  };
}

async function main(): Promise<void> {
  let child = start(filename);

  process.on("exit", () => {
    void child.kill();
  });

  const iterable = fs.watch("./dist", { recursive: true });

  for await (const _ of iterable) {
    await child.kill();
    child = start(filename);
  }
}

await main();
