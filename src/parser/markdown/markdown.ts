import { cat } from "../combinators/cat.js";
import { rep } from "../combinators/rep.js";
import { anyChar } from "../primitives/anyChar.js";
import { char } from "../primitives/char.js";
import type { ParserInput } from "../types/ParseInput.js";
import type { ParserOutput } from "../types/ParserOutput.js";
import { map } from "../utils/map.js";
import { yaml } from "../yaml/yaml.js";

function hr(input: ParserInput): ParserOutput<"---\n"> {
  return map(
    cat([char("-"), char("-"), char("-"), char("\n")]),
    () => "---\n" as const
  )(input);
}

function content(input: ParserInput): ParserOutput<string> {
  return map(rep(anyChar, 0), (cs) => cs.join("").trim())(input);
}

type Markdown = {
  frontmatter: Record<string, string>;
  content: string;
};

export function markdown(input: ParserInput): ParserOutput<Markdown> {
  return map(cat([hr, yaml, hr, content]), ([, frontmatter, , content]) => ({
    frontmatter,
    content,
  }))(input);
}
