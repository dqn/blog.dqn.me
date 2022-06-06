import { ParserInput } from "../types/ParseInput.js";
import { Parser } from "../types/Parser.js";
import { ParserData } from "../types/ParserData.js";
import { ParserOutput } from "../types/ParserOutput.js";

type ParserDataList<T extends readonly Parser<unknown>[]> = {
  [P in keyof T]: ParserData<T[P]>;
};

export function cat<T extends readonly Parser<unknown>[]>(
  ps: [...T]
): (input: ParserInput) => ParserOutput<ParserDataList<T>> {
  return (input) => {
    const rs = [];
    let i = input;

    for (const p of ps) {
      const r = p(i);

      if (!r.success) {
        return r;
      }

      rs.push(r.data);
      i = r.rest;
    }

    return {
      success: true,
      data: rs as ParserDataList<T>,
      rest: i,
    };
  };
}
