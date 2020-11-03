import test from "ava";
import { mapAttributes, mapAttributesInverse } from "repository-provider";

function mat(t, a, b, c) {
  t.deepEqual(mapAttributes(a, b), c);
}

mat.title = (providedTitle = "", a, b, c) =>
  `attribute mapping ${providedTitle} ${JSON.stringify(a)} ${JSON.stringify(
    b
  )}`.trim();

function mait(t, a, b, c) {
  t.deepEqual(mapAttributesInverse(a, b), c);
}

mait.title = (providedTitle = "", a, b, c) =>
  `attribute mapping inverse ${providedTitle} ${JSON.stringify(
    a
  )} ${JSON.stringify(b)}`.trim();

test(mat, undefined, undefined, undefined);
test(mat, undefined, { a: "a'" }, undefined);
test(mait, undefined, undefined, undefined);
test(mait, undefined, { a: "a'" }, undefined);

test(
  mat,
  { a: 1, b: "2" },
  { a: "a'" },
  {
    "a'": 1,
    b: "2"
  }
);

test(
  mait,
  { "a'": 1, b: "2" },
  { a: "a'" },
  {
    a: 1,
    b: "2"
  }
);

test(
  mat,
  { a: 1, b: "2", c: "", d: null, e: undefined },
  { a: "a'" },
  {
    "a'": 1,
    b: "2"
  }
);

test(
  mait,
  { "a'": 1, b: "2", c: "", d: null, e: undefined },
  { "a'": "a" },
  {
    "a'": 1,
    b: "2"
  }
);

test.skip(
  mat,
  { a: { b: { c: 1 } } },
  { "a.b.c": "a'" },
  {
    "a'": 1
  }
);
