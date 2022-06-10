import test from "node:test";
import assert from "node:assert/strict";
import { css } from "../css.js";

const input = `
html {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Yu Gothic",
    "YuGothic", Verdana, Meiryo, sans-serif;
  background-color: #665886;
  color: #fff;
}

.mt-8 {
  margin-top: 8rem;
}
`;
type Output = ReturnType<typeof css>;

test("css", () => {
  const output = css([...input]);
  assert.deepStrictEqual<Output>(output, {
    success: true,
    data: {
      rules: [
        {
          selectors: ["html"],
          declarations: {
            "font-family": `-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Yu Gothic",
    "YuGothic", Verdana, Meiryo, sans-serif`,
            "background-color": "#665886",
            color: "#fff",
          },
        },
        {
          selectors: [".mt-8"],
          declarations: {
            "margin-top": "8rem",
          },
        },
      ],
    },
    rest: [],
  });
});
