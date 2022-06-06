import test from "node:test";
import assert from "node:assert/strict";
import { char } from "../../primitives/char.js";
import { not } from "../not.js";

const parser = not(char("a"));
type Output = ReturnType<typeof parser>;

test("empty", () => {
  const input: string[] = [];
  const output = parser(input);
  assert.deepStrictEqual<Output>(output, {
    success: true,
    data: null,
    rest: [],
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
    data: null,
    rest: [..."A"],
  });
});

test("'foo'", () => {
  const input = [..."foo"];
  const output = parser(input);
  assert.deepStrictEqual<Output>(output, {
    success: true,
    data: null,
    rest: [..."foo"],
  });
});
