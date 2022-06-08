import type { ParserInput } from "../types/ParseInput.js";
import type { ParserOutput } from "../types/ParserOutput.js";

export function eof(input: ParserInput): ParserOutput<null> {
  if (input.length === 0) {
    return {
      success: true,
      data: null,
      rest: [],
    };
  }

  return {
    success: false,
  };
}
