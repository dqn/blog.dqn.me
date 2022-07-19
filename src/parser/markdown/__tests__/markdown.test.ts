import test from "node:test";
import assert from "node:assert/strict";
import { markdown } from "../markdown.js";

const input = `---
foo: bar
baz: qux
---

hogefugafugahoge
`;
type Output = ReturnType<typeof markdown>;

test("markdown", () => {
  const output = markdown([...input]);
  assert.deepStrictEqual<Output>(output, {
    success: true,
    data: {
      frontmatter: {
        foo: "bar",
        baz: "qux",
      },
      content: "\nhogefugafugahoge\n",
    },
    rest: [],
  });
});
