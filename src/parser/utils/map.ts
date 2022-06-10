import type { ParserInput } from "../types/ParseInput.js";
import type { Parser } from "../types/Parser.js";
import type { ParserOutput } from "../types/ParserOutput.js";

export function map<T, U>(
  p: Parser<T>,
  f: (c: T) => U
): (input: ParserInput) => ParserOutput<U> {
  return (input) => {
    const r = p(input);

    if (!r.success) {
      return r;
    }

    return {
      success: true,
      data: f(r.data),
      rest: r.rest,
    };
  };
}
