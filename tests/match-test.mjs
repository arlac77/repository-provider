import test from "ava";
import { match } from "repository-provider";

async function mt(t, pattern, entries, result) {
  const r = [...match(entries, pattern)];
  //console.log(">>", r);
  t.deepEqual(r, result);
}

mt.title = (providedTitle = "", pattern, entries, result) =>
  `match ${providedTitle} ${pattern} ${entries}`.trim();

test(mt, undefined, ["a", "b", "c"], ["a", "b", "c"]);
test(mt, [], ["a", "b", "c"], ["a", "b", "c"]);
test(mt, "a", ["a", "b", "c"], ["a"]);
test(mt, ["a", "b"], ["a", "b", "c"], ["a", "b"]);

test(mt, "*", ["a", "b", "c"], ["a", "b", "c"]);
test(mt, "*.c", ["a.a", "a.b", "a.c"], ["a.c"]);
test(mt, ["*.c", "*.a"], ["a.a", "a.b", "a.c"], ["a.a", "a.c"]);

test(mt, "!banana", ["apple", "banana", "citrus"], ["apple", "citrus"]);
test(mt, "!*.c", ["a.a", "a.b", "a.c"], ["a.a", "a.b"]);

test(
  mt,
  "**/rollup.config.*js",
  ["rollup.config.mjs", "rollupx.config.mjs", "tests/rollup.config.mjs"],
  ["rollup.config.mjs", "tests/rollup.config.mjs"]
);

test.skip(
  mt,
  ["**/package.json", "!test/**/*", "!tests/**/*"],
  [
    ".gitignore",
    "package.json",
    "tests/rollup.config.mjs",
    "test/fixtures/package.json"
  ],
  ["package.json"]
);

test.skip(
  mt,
  ["**/*.mjs", "!tests/*.mjs"],
  ["a.mjs", "b.mjs", "tests/c.mjs"],
  ["a.mjs", "b.mjs"]
);

test(
  mt,
  ".github/workflows/*.yml",
  [".github/workflows/ci.yml", "ci.yml", ".github/ci.yml"],
  [".github/workflows/ci.yml"]
);
