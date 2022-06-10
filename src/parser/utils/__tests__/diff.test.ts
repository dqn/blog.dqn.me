import test from "node:test";
import assert from "node:assert/strict";
import { char } from "../../primitives/char.js";
import { anyChar } from "../../primitives/anyChar.js";
import { diff } from "../diff.js";

const parser = diff(anyChar, char("0"));
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

test("'0'", () => {
  const input = [..."0"];
  const output = parser(input);
  assert.deepStrictEqual<Output>(output, {
    success: false,
  });
});

test("'5'", () => {
  const input = [..."5"];
  const output = parser(input);
  assert.deepStrictEqual<Output>(output, {
    success: true,
    data: "5",
    rest: [],
  });
});
