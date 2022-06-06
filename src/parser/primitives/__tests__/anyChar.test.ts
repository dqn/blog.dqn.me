import test from "node:test";
import assert from "node:assert/strict";
import { anyChar } from "../anyChar.js";

type Output = ReturnType<typeof anyChar>;

test("empty", () => {
  const input: string[] = [];
  const output = anyChar(input);
  assert.deepStrictEqual<Output>(output, {
    success: false,
  });
});

test("1 char", () => {
  const input = [..."a"];
  const output = anyChar(input);
  assert.deepStrictEqual<Output>(output, {
    success: true,
    data: "a",
    rest: [],
  });
});

test("multiple chars", () => {
  const input = [..."foo"];
  const output = anyChar(input);
  assert.deepStrictEqual<Output>(output, {
    success: true,
    data: "f",
    rest: ["o", "o"],
  });
});
