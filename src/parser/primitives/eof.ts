import { ParserInput } from "../types/ParseInput.js";
import { ParserOutput } from "../types/ParserOutput.js";

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
