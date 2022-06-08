import { unwrap } from "../../utils/unwrap.js";
import type { ParserInput } from "../types/ParseInput.js";
import type { ParserOutput } from "../types/ParserOutput.js";

export function anyChar(input: ParserInput): ParserOutput<string> {
  if (input.length === 0) {
    return { success: false };
  }

  const [data, ...rest] = input;

  return {
    success: true,
    data: unwrap(data, "data"),
    rest,
  };
}
