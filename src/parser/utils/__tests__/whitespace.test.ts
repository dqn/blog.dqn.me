import test from "node:test";
import assert from "node:assert/strict";
import { whitespace } from "../whitespace.js";

const parser = whitespace;
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

test("'abc'", () => {
  const input = [..."abc"];
  const output = parser(input);
  assert.deepStrictEqual<Output>(output, {
    success: true,
    data: null,
    rest: [..."abc"],
  });
});

test("'\\t\\n\\r hoge'", () => {
  const input = [..."\t\n\r hoge"];
  const output = parser(input);
  assert.deepStrictEqual<Output>(output, {
    success: true,
    data: null,
    rest: [..."hoge"],
  });
});
