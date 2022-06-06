import test from "node:test";
import assert from "node:assert/strict";
import { char } from "../../primitives/char.js";
import { or } from "../or.js";

test("or([])", async (t) => {
  const parser = or([]);
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
});

test('or([char("a"), char("b")])', async (t) => {
  const parser = or([char("a"), char("b")]);
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
      success: true,
      data: "a",
      rest: [],
    });
  });

  await t.test("'b'", () => {
    const input = [..."b"];
    const output = parser(input);
    assert.deepStrictEqual<Output>(output, {
      success: true,
      data: "b",
      rest: [],
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
