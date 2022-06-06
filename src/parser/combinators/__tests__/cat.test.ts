import test from "node:test";
import assert from "node:assert/strict";
import { char } from "../../primitives/char.js";
import { cat } from "../cat.js";

test("cat([])", async (t) => {
  const parser = cat([]);
  type Output = ReturnType<typeof parser>;

  await t.test("empty", () => {
    const input: string[] = [];
    const output = parser(input);
    assert.deepStrictEqual<Output>(output, {
      success: true,
      data: [],
      rest: [],
    });
  });

  await t.test("'a'", () => {
    const input = [..."a"];
    const output = parser(input);
    assert.deepStrictEqual<Output>(output, {
      success: true,
      data: [],
      rest: [..."a"],
    });
  });
});

test('cat([char("a"), char("b")])', async (t) => {
  const parser = cat([char("a"), char("b")]);
  type Output = ReturnType<typeof parser>;

  await t.test("empty", () => {
    const input: string[] = [];
    const output = parser(input);
    assert.deepStrictEqual<Output>(output, {
      success: false,
    });
  });

  await t.test("'a'", () => {
    const input = [..."a"];
    const output = parser(input);
    assert.deepStrictEqual<Output>(output, {
      success: false,
    });
  });

  await t.test("'abc'", () => {
    const input = [..."abc"];
    const output = parser(input);
    assert.deepStrictEqual<Output>(output, {
      success: true,
      data: ["a", "b"],
      rest: [..."c"],
    });
  });

  await t.test("'A'", () => {
    const input = [..."A"];
    const output = parser(input);
    assert.deepStrictEqual<Output>(output, {
      success: false,
    });
  });
});
