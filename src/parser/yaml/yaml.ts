import { cat } from "../combinators/cat.js";
import { or } from "../combinators/or.js";
import { rep } from "../combinators/rep.js";
import { anyChar } from "../primitives/anyChar.js";
import { char } from "../primitives/char.js";
import type { ParserInput } from "../types/ParseInput.js";
import type { ParserOutput } from "../types/ParserOutput.js";
import { alpha } from "../utils/alpha.js";
import { diff } from "../utils/diff.js";
import { digit } from "../utils/digit.js";
import { map } from "../utils/map.js";
import { whitespace } from "../utils/whitespace.js";

function property(input: ParserInput): ParserOutput<string> {
  return map(rep(or([alpha, digit, char("-")]), 1), (cs) => cs.join(""))(input);
}

function value(input: ParserInput): ParserOutput<string> {
  return map(rep(diff(anyChar, char("\n"))), (cs) =>
    cs.flatMap((x) => x ?? []).join("")
  )(input);
}

function declaration(input: ParserInput): ParserOutput<[string, string]> {
  return map(
    cat([property, char(":"), whitespace, value]),
    ([k, , , v]): [string, string] => [k, v]
  )(input);
}

export type Yaml = Record<string, string>;

export function yaml(input: ParserInput): ParserOutput<Yaml> {
  return map(
    cat([whitespace, rep(cat([declaration, char("\n")])), whitespace]),
    ([, xs]) => Object.fromEntries(xs.map(([x]) => x))
  )(input);
}
