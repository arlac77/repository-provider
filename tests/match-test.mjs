import test from "ava";
import { match } from "repository-provider";

async function mt(t, entries, pattern, result) {
  const r = [...match(entries, pattern)];
  t.deepEqual(r, result);
}

mt.title = (providedTitle = "", entries, pattern, result) =>
  `match ${providedTitle} ${entries} ${pattern}`.trim();

test(mt, ["a", "b", "c"], undefined, ["a", "b", "c"]);
test(mt, ["a", "b", "c"], "*", ["a", "b", "c"]);
test(mt, ["a", "b", "c"], "a", ["a"]);
test(mt, ["a.a", "a.b", "a.c"], "*.c", ["a.c"]);
test(mt, ["a.a", "a.b", "a.c"], ["*.c", "*.a"], ["a.a", "a.c"]);

test(mt, ["apple", "banana", "citrus"], "!banana", ["apple", "citrus"]);
test(mt, ["a.a", "a.b", "a.c"], "!*.c", ["a.a", "a.b"]);

test(
  mt,
  ["rollup.config.mjs", "rollupx.config.mjs", "tests/rollup.config.mjs"],
  "**/rollup.config.*js",
  ["rollup.config.mjs", "tests/rollup.config.mjs"]
);

//test(mt, ["a.mjs", "b.mjs", "tests/c.mjs"], ["**/*.mjs", "!tests/*.mjs"], ["a.mjs", "b.mjs"]);
