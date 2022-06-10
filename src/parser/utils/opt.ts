import { rep } from "../combinators/rep.js";
import type { Option } from "../types/Option.js";
import type { ParserInput } from "../types/ParseInput.js";
import type { Parser } from "../types/Parser.js";
import type { ParserOutput } from "../types/ParserOutput.js";

export function opt<T>(
  p: Parser<T>
): (input: ParserInput) => ParserOutput<Option<T>> {
  return (input) => {
    const r = rep(p, 0, 1)(input);

    if (!r.success) {
      return r;
    }

    return {
      success: true,
      data:
        r.data.length === 0
          ? { status: "none" }
          : { status: "some", value: r.data[0] as T },
      rest: r.rest,
    };
  };
}
