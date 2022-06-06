import test from "node:test";
import assert from "node:assert/strict";
import { eof } from "../eof.js";

type Output = ReturnType<typeof eof>;

test("eof", () => {
  const input: string[] = [];
  const output = eof(input);
  assert.deepStrictEqual<Output>(output, {
    success: true,
    data: null,
    rest: [],
  });
});

test("1 char", () => {
  const input = [..."a"];
  const output = eof(input);
  assert.deepStrictEqual<Output>(output, {
    success: false,
  });
});
