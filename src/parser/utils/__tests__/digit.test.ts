import test from "node:test";
import assert from "node:assert/strict";
import { digit } from "../digit.js";

const parser = digit;
type Output = ReturnType<typeof digit>;

test("empty", () => {
  const input: string[] = [];
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

test("'a'", () => {
  const input = [..."a"];
  const output = parser(input);
  assert.deepStrictEqual<Output>(output, {
    success: false,
  });
});
