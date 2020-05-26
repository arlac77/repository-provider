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
