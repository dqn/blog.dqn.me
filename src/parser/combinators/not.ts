import { ParserInput } from "../types/ParseInput.js";
import { Parser } from "../types/Parser.js";
import { ParserOutput } from "../types/ParserOutput.js";

export function not(
  p: Parser<unknown>
): (input: ParserInput) => ParserOutput<null> {
  return (input) => {
    if (p(input).success) {
      return {
        success: false,
      };
    } else {
      return {
        success: true,
        data: null,
        rest: input,
      };
    }
  };
}
