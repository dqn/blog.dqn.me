import test from "node:test";
import assert from "node:assert/strict";
import { upperAlpha } from "../upperAlpha.js";

const parser = upperAlpha;
type Output = ReturnType<typeof upperAlpha>;

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
    success: false,
  });
});

test("'A'", () => {
  const input = [..."A"];
  const output = parser(input);
  assert.deepStrictEqual<Output>(output, {
    success: true,
    data: "A",
    rest: [],
  });
});
