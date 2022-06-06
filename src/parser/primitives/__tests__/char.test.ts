import test from "node:test";
import assert from "node:assert/strict";
import { char } from "../char.js";

const parser = char("a");
type Output = ReturnType<typeof parser>;

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

test("multiple chars", () => {
  const input = [..."foo"];
  const output = parser(input);
  assert.deepStrictEqual<Output>(output, {
    success: false,
  });
});
