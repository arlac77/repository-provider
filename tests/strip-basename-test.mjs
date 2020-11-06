import test from "ava";
import { stripBaseName, stripBaseNames } from "../src/util.mjs";

function quote(names) {
  return names === undefined
    ? "undefined"
    : Array.isArray(names)
    ? "[" + names.map(n => "'" + n + "'").join(",") + "]"
    : "'" + names + "'";
}
async function sbnt(t, name, bases = [], expected, expectExtractedBase) {
  t.is(stripBaseName(name, bases), expected, "stripped name");

  let extractedBase;

  stripBaseName(name, bases, found => (extractedBase = found));

  t.is(extractedBase, expectExtractedBase, "extracted baseName");
}

sbnt.title = (providedTitle = "", name, bases) =>
  `stripBaseName ${providedTitle} ${quote(name)} ${quote(bases)}`.trim();

test(sbnt, "", [], "");

test(sbnt, "arlac77/myrepo.git", ["https://github.com/"], "arlac77/myrepo.git");

test(
  sbnt,
  "arlac77/myrepo.git#master",
  ["https://github.com/"],
  "arlac77/myrepo.git#master"
);

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
  "https://user@github.com/arlac77/myrepo.git#master",
  ["https://github.com/"],
  "arlac77/myrepo.git#master",
  "https://github.com/"
);

test(
  sbnt,
  "https://user@github.com/arlac77/myrepo.git#*",
  ["https://github.com/"],
  "arlac77/myrepo.git#*",
  "https://github.com/"
);

test(
  sbnt,
  "https://user:pass@github.com/arlac77/myrepo.git",
  ["https://github.com/"],
  "arlac77/myrepo.git",
  "https://github.com/"
);

async function sbnst(t, names, bases = [], expected, expectExtractedBases) {
  t.deepEqual(stripBaseNames(names, bases), expected, "stripped name");

  const extractedBases = [];

  stripBaseNames(names, bases, found => extractedBases.push(found));

  t.deepEqual(extractedBases, expectExtractedBases, "extracted baseNames");
}

sbnst.title = (providedTitle = "", names, bases) =>
  `stripBaseNames ${providedTitle} ${quote(names)} ${quote(bases)}`.trim();

test(
  sbnst,
  ["https://user:pass@github.com/arlac77/myrepo.git"],
  ["https://github.com/"],
  ["arlac77/myrepo.git"],
  ["https://github.com/"]
);

test(
  sbnst,
  "https://user:pass@github.com/arlac77/myrepo.git",
  ["https://github.com/"],
  "arlac77/myrepo.git",
  ["https://github.com/"]
);

test(sbnst, [], ["https://github.com/"], [], []);

test(sbnst, undefined, ["https://github.com/"], undefined, []);
