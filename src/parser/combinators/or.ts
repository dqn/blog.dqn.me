import type { ParserInput } from "../types/ParseInput.js";
import type { Parser } from "../types/Parser.js";
import type { ParserOutput } from "../types/ParserOutput.js";

export function or<T>(
  ps: readonly Parser<T>[]
): (input: ParserInput) => ParserOutput<T> {
  return (input) => {
    for (const p of ps) {
      const r = p(input);

      if (r.success) {
        return r;
      }
    }

    return {
      success: false,
    };
  };
}
