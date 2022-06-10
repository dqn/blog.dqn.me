import { is } from "../primitives/is.js";
import type { LowerAlphabet } from "../types/LowerAlphabet.js";
import type { ParserInput } from "../types/ParseInput.js";
import type { ParserOutput } from "../types/ParserOutput.js";

export function lowerAlpha(input: ParserInput): ParserOutput<LowerAlphabet> {
  return is((c): c is LowerAlphabet => /^[a-z]$/.test(c))(input);
}
