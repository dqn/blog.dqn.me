import { ParseFail } from "./ParseFail.js";
import { ParseSuccess } from "./ParseSuccess.js";

export type ParserOutput<T> = ParseSuccess<T> | ParseFail;
