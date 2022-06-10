import test from "node:test";
import assert from "node:assert/strict";
import { opt } from "../opt.js";
import { char } from "../../primitives/char.js";

const parser = opt(char("a"));
type Output = ReturnType<typeof parser>;

test("empty", () => {
  const input: string[] = [];
  const output = parser(input);
  assert.deepStrictEqual<Output>(output, {
    success: true,
    data: { status: "none" },
    rest: [],
  });
});

test('Input "a"', () => {
  const input = [..."a"];
  const output = parser(input);
  assert.deepStrictEqual<Output>(output, {
    success: true,
    data: { status: "some", value: "a" },
    rest: [],
  });
});

test('Input "aa"', () => {
  const input = [..."aa"];
  const output = parser(input);
  assert.deepStrictEqual<Output>(output, {
    success: true,
    data: { status: "some", value: "a" },
    rest: [..."a"],
  });
});

test('Input "b"', () => {
  const input = [..."b"];
  const output = parser(input);
  assert.deepStrictEqual<Output>(output, {
    success: true,
    data: { status: "none" },
    rest: [..."b"],
  });
});
