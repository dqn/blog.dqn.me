import { or } from "../combinators/or.js";
import { rep } from "../combinators/rep.js";
import type { ParserInput } from "../types/ParseInput.js";
import type { ParserOutput } from "../types/ParserOutput.js";
import { map } from "./map.js";
import { char } from "../primitives/char.js";

export function whitespace(input: ParserInput): ParserOutput<null> {
  return map(rep(or([..."\t\n\r "].map(char))), () => null)(input);
}
