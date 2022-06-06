import { ParserInput } from "../types/ParseInput.js";
import { ParserOutput } from "../types/ParserOutput.js";
import { anyChar } from "./anyChar.js";

export function char(
  c: ParserInput[0]
): (input: ParserInput) => ParserOutput<string> {
  return (input) => {
    const r = anyChar(input);

    if (!r.success) {
      return r;
    }

    if (r.data !== c) {
      return {
        success: false,
      };
    }

    return {
      success: true,
      data: c,
      rest: r.rest,
    };
  };
}
