import { is } from "../primitives/is.js";
import type { Alphabet } from "../types/Alphabet.js";
import type { ParserInput } from "../types/ParseInput.js";
import type { ParserOutput } from "../types/ParserOutput.js";

export function alpha(input: ParserInput): ParserOutput<Alphabet> {
  return is((c): c is Alphabet => /^[a-zA-Z]$/.test(c))(input);
}
