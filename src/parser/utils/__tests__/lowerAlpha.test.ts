import test from "node:test";
import assert from "node:assert/strict";
import { lowerAlpha } from "../lowerAlpha.js";

const parser = lowerAlpha;
type Output = ReturnType<typeof lowerAlpha>;

test("empty", () => {
  const input: string[] = [];
  const output = parser(input);
  assert.deepStrictEqual<Output>(output, {
    success: false,
  });
});

test("'a'", () => {
  const input = [..."a"];
  const output = parser(input);
  assert.deepStrictEqual<Output>(output, {
    success: true,
    data: "a",
    rest: [],
  });
});

test("'A'", () => {
  const input = [..."A"];
  const output = parser(input);
  assert.deepStrictEqual<Output>(output, {
    success: false,
  });
});
