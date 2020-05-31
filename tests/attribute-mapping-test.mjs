import test from "ava";
import { mapAttributes } from "../src/util.mjs";

function amt(t, a, b, c) {
  t.deepEqual(mapAttributes(a, b), c);
}

amt.title = (providedTitle = "", a, b, c) =>
  `attribut mapping ${providedTitle} ${JSON.stringify(a)} ${b}`.trim();

test(amt, undefined, { a: "A" }, undefined);

test(
  amt,
  { a: 1, b: "2" },
  { a: "A" },
  {
    A: 1,
    b: "2"
  }
);

test(
  amt,
  { a: 1, b: "2", c: "", d: null, e: undefined },
  { a: "A" },
  {
    A: 1,
    b: "2"
  }
);

test.skip(
  amt,
  { a: { b: { c: 1 } } },
  { "a.b.c": "A" },
  {
    A: 1
  }
);
