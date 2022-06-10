import { is } from "../primitives/is.js";
import type { Digit } from "../types/Digit.js";
import type { ParserInput } from "../types/ParseInput.js";
import type { ParserOutput } from "../types/ParserOutput.js";

export function digit(input: ParserInput): ParserOutput<Digit> {
  return is((c): c is Digit => /^\d$/.test(c))(input);
}
