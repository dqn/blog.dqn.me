import { cat } from "../combinators/cat.js";
import { or } from "../combinators/or.js";
import { rep } from "../combinators/rep.js";
import { char } from "../primitives/char.js";
import type { ParserInput } from "../types/ParseInput.js";
import type { ParserOutput } from "../types/ParserOutput.js";
import { alpha } from "../utils/alpha.js";
import { digit } from "../utils/digit.js";
import { map } from "../utils/map.js";
import { whitespace } from "../utils/whitespace.js";

function selector(input: ParserInput): ParserOutput<string> {
  return map(
    rep(or([alpha, digit, char("-"), char("."), char(":")]), 1),
    (cs) => cs.join("")
  )(input);
}

function property(input: ParserInput): ParserOutput<string> {
  return map(rep(or([alpha, digit, char("-")]), 1), (cs) => cs.join(""))(input);
}

function value(input: ParserInput): ParserOutput<string> {
  return map(
    rep(
      or([
        alpha,
        digit,
        char("-"),
        char(","),
        char(`"`),
        char("#"),
        char(" "),
        char("\n"),
      ]),
      1
    ),
    (cs) => cs?.flatMap((x) => x ?? []).join("")
  )(input);
}

function declaration(input: ParserInput): ParserOutput<[string, string]> {
  return map(
    cat([property, whitespace, char(":"), whitespace, value, char(";")]),
    ([k, , , , v]): [string, string] => [k, v]
  )(input);
}

type Declarations = Record<string, string>;

function block(input: ParserInput): ParserOutput<Declarations> {
  return map(
    cat([
      char("{"),
      rep(cat([whitespace, declaration, whitespace])),
      char("}"),
    ]),
    ([, xs, ,]) => Object.fromEntries(xs.map(([, pair]) => pair))
  )(input);
}

type Rule = {
  selectors: string[];
  declarations: Declarations;
};

function rule(input: ParserInput): ParserOutput<Rule> {
  return map(
    cat([
      selector,
      rep(cat([whitespace, char(","), whitespace, selector])),
      whitespace,
      block,
    ]),
    ([selector, selectors, , declarations]): Rule => ({
      selectors: [selector, ...selectors.flatMap(([, , , s]) => s)],
      declarations,
    })
  )(input);
}

type Css = {
  rules: Rule[];
};

export function css(input: ParserInput): ParserOutput<Css> {
  return map(rep(cat([whitespace, rule, whitespace])), (xs) => ({
    rules: xs.map(([, r]) => r),
  }))(input);
}
