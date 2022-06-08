import type { Parser } from "./Parser.js";

export type ParserData<P> = P extends Parser<infer T> ? T : never;
