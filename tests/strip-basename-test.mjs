import test from "ava";
import { stripBaseName } from "../src/util.mjs";

async function sbnt(t, name, bases = [], expected) {
  t.is(stripBaseName(name, bases), expected);
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
  "arlac77/myrepo.git"
);
