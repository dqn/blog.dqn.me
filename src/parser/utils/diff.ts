import { cat } from "../combinators/cat.js";
import { not } from "../combinators/not.js";
import type { ParserInput } from "../types/ParseInput.js";
import type { Parser } from "../types/Parser.js";
import type { ParserOutput } from "../types/ParserOutput.js";
import { map } from "./map.js";

export function diff<T, U>(
  p: Parser<T>,
  q: Parser<U>
): (input: ParserInput) => ParserOutput<T> {
  return map(cat([not(q), p]), ([, r]) => r);
}
