import test from "node:test";
import assert from "node:assert/strict";
import { is } from "../is.js";

test("is((c) => c === 'a')", async (t) => {
  const parser = is((c): c is "a" => c === "a");
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

  await t.test("'A'", () => {
    const input = [..."A"];
    const output = parser(input);
    assert.deepStrictEqual<Output>(output, {
      success: false,
    });
  });
});

test("is((c) => c === '0' || c === '1')", async (t) => {
  const parser = is((c): c is "0" | "1" => c === "0" || c === "1");
  type Output = ReturnType<typeof parser>;

  await t.test("empty", () => {
    const input: string[] = [];
    const output = parser(input);
    assert.deepStrictEqual<Output>(output, {
      success: false,
    });
  });

  await t.test("'0'", () => {
    const input = [..."0"];
    const output = parser(input);
    assert.deepStrictEqual<Output>(output, {
      success: true,
      data: "0",
      rest: [],
    });
  });

  await t.test("'1'", () => {
    const input = [..."1"];
    const output = parser(input);
    assert.deepStrictEqual<Output>(output, {
      success: true,
      data: "1",
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
