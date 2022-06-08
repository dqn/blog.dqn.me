import type { ParserInput } from "./ParseInput.js";
import type { ParserOutput } from "./ParserOutput.js";

export type Parser<T> = (input: ParserInput) => ParserOutput<T>;
