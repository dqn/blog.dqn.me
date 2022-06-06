import { Parser } from "../types/Parser.js";
import { ParserData } from "../types/ParserData.js";

export function rep<T>(
  p: Parser<T>,
  min = 0,
  max = Number.POSITIVE_INFINITY
): Parser<T[]> {
  return (input) => {
    if (min > max) {
      throw new Error("rep: min > max is not allowed.");
    }

    if (min < 0) {
      throw new Error("rep: negative min is not allowed.");
    }

    if (max < 0) {
      throw new Error("rep: negative max is not allowed.");
    }

    const rs: ParserData<typeof p>[] = [];
    let i = input;

    for (let n = 0; n < max; n++) {
      const r = p(i);

      if (!r.success) {
        break;
      }

      rs.push(r.data);
      i = r.rest;
    }

    if (rs.length < min) {
      return {
        success: false,
      };
    }

    return {
      success: true,
      data: rs,
      rest: i,
    };
  };
}
