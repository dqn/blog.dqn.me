import { is } from "../primitives/is.js";
import type { ParserInput } from "../types/ParseInput.js";
import type { ParserOutput } from "../types/ParserOutput.js";
import type { UpperAlphabet } from "../types/UpperAlphabet.js";

export function upperAlpha(input: ParserInput): ParserOutput<UpperAlphabet> {
  return is((c): c is UpperAlphabet => /^[A-Z]$/.test(c))(input);
}
