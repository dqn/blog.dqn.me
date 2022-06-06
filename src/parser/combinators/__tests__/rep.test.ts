import test from "node:test";
import assert from "node:assert/strict";
import { char } from "../../primitives/char.js";
import { rep } from "../rep.js";

test('rep(char("a"))', async (t) => {
  const parser = rep(char("a"));
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
      data: ["a"],
      rest: [],
    });
  });

  await t.test("'aa'", () => {
    const input = [..."aa"];
    const output = parser(input);
    assert.deepStrictEqual<Output>(output, {
      success: true,
      data: ["a", "a"],
      rest: [],
    });
  });

  await t.test("'aab'", () => {
    const input = [..."aab"];
    const output = parser(input);
    assert.deepStrictEqual<Output>(output, {
      success: true,
      data: ["a", "a"],
      rest: [..."b"],
    });
  });
});

test('rep(char("a"), 1)', async (t) => {
  const parser = rep(char("a"), 1);
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
      data: ["a"],
      rest: [],
    });
  });

  await t.test("'aa'", () => {
    const input = [..."aa"];
    const output = parser(input);
    assert.deepStrictEqual<Output>(output, {
      success: true,
      data: ["a", "a"],
      rest: [],
    });
  });

  await t.test("'aab'", () => {
    const input = [..."aab"];
    const output = parser(input);
    assert.deepStrictEqual<Output>(output, {
      success: true,
      data: ["a", "a"],
      rest: [..."b"],
    });
  });
});

test('rep(char("a"), 1, 2)', async (t) => {
  const parser = rep(char("a"), 1, 2);
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
      data: ["a"],
      rest: [],
    });
  });

  await t.test("'aa'", () => {
    const input = [..."aa"];
    const output = parser(input);
    assert.deepStrictEqual<Output>(output, {
      success: true,
      data: ["a", "a"],
      rest: [],
    });
  });

  await t.test("'aaa'", () => {
    const input = [..."aaa"];
    const output = parser(input);
    assert.deepStrictEqual<Output>(output, {
      success: true,
      data: ["a", "a"],
      rest: [..."a"],
    });
  });
});
