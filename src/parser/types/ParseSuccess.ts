import type { ParserInput } from "./ParseInput.js";

export type ParseSuccess<T> = {
  success: true;
  data: T;
  rest: ParserInput;
};
