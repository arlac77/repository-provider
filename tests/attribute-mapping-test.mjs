import test from "ava";
import { mapAttributes, mapAttributesInverse } from "repository-provider";

function mat(t, a, b, c) {
  t.deepEqual(mapAttributes(a, b), c);
}

mat.title = (providedTitle = "", a, b, c) =>
  `attribute mapping ${providedTitle} ${JSON.stringify(a)} ${b}`.trim();

function mait(t, a, b, c) {
  t.deepEqual(mapAttributesInverse(a, b), c);
}

mait.title = (providedTitle = "", a, b, c) =>
  `attribute mapping inverse ${providedTitle} ${JSON.stringify(a)} ${b}`.trim();

test(mat, undefined, { a: "A" }, undefined);
test(mait, undefined, { a: "A" }, undefined);

test(
  mat,
  { a: 1, b: "2" },
  { a: "A" },
  {
    A: 1,
    b: "2"
  }
);

test(
  mait,
  { A: 1, b: "2" },
  { a: "A" },
  {
    a: 1,
    b: "2"
  }
);

test(
  mat,
  { a: 1, b: "2", c: "", d: null, e: undefined },
  { a: "A" },
  {
    A: 1,
    b: "2"
  }
);

test.skip(
  mat,
  { a: { b: { c: 1 } } },
  { "a.b.c": "A" },
  {
    A: 1
  }
);
