import test from "ava";
import { stripBaseName } from "../src/util.mjs";

async function sbnt(t, name, bases = [], expected, expectExtractedBase) {
  t.is(stripBaseName(name, bases), expected, "stripped name");

  let extractedBase;

  stripBaseName(name, bases, found => (extractedBase = found));

  t.is(extractedBase, expectExtractedBase, "extracted baseName");
}

sbnt.title = (providedTitle = "", name, bases) =>
  `stripBaseName ${providedTitle} '${name}' [${bases
    .map(n => `'${n}'`)
    .join(",")}]`.trim();

test(sbnt, "", [], "");
test(
  sbnt,
  "https://github.com/arlac77/myrepo.git",
  ["https://github.com/"],
  "arlac77/myrepo.git",
  "https://github.com/"
);

test(
  sbnt,
  "https://user@github.com/arlac77/myrepo.git",
  ["https://github.com/"],
  "arlac77/myrepo.git",
  "https://github.com/"
);

test(
  sbnt,
  "https://user:pass@github.com/arlac77/myrepo.git",
  ["https://github.com/"],
  "arlac77/myrepo.git",
  "https://github.com/"
);
