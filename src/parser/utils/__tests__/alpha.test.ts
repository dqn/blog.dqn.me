import test from "node:test";
import assert from "node:assert/strict";
import { alpha } from "../alpha.js";

const parser = alpha;
type Output = ReturnType<typeof alpha>;

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
    success: true,
    data: "A",
    rest: [],
  });
});
