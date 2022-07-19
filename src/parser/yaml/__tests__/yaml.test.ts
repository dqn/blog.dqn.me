import test from "node:test";
import assert from "node:assert/strict";
import { yaml } from "../yaml.js";

const input = `
foo: bar
baz: qux
`;
type Output = ReturnType<typeof yaml>;

test("yaml", () => {
  const output = yaml([...input]);
  assert.deepStrictEqual<Output>(output, {
    success: true,
    data: {
      foo: "bar",
      baz: "qux",
    },
    rest: [],
  });
});
