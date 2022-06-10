import test from "node:test";
import assert from "node:assert/strict";
import { map } from "../map.js";
import { anyChar } from "../../primitives/anyChar.js";

const parser = map(anyChar, (s) => Number.parseInt(s, 10));
type Output = ReturnType<typeof parser>;

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
    data: 5,
    rest: [],
  });
});
