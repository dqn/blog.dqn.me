import { ParserInput } from "./ParseInput.js";
import { ParserOutput } from "./ParserOutput.js";

export type Parser<T> = (input: ParserInput) => ParserOutput<T>;
