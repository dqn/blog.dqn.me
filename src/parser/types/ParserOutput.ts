import type { ParseFail } from "./ParseFail.js";
import type { ParseSuccess } from "./ParseSuccess.js";

export type ParserOutput<T> = ParseSuccess<T> | ParseFail;
