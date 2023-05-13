import test from "ava";
import {
  SingleGroupProvider,
  Branch,
  generateBranchName
} from "repository-provider";
import { asArray, stripBaseNames, stripBaseName } from "../src/util.mjs";

test("asArray from scalar", t => t.deepEqual(asArray(1), [1]));
test("asArray from array", t => t.deepEqual(asArray([1]), [1]));
test("asArray from undefined", t => t.deepEqual(asArray(undefined), []));

async function gbnt(t, branchNames, pattern, result) {
  const provider = new SingleGroupProvider();
  const repository = await provider.createRepository("r1");

  for (const bn of branchNames) {
    new Branch(repository, bn);
  }

  t.is(await generateBranchName(repository, pattern), result);
}

gbnt.title = (providedTitle = "generateBranchName", a, b, c) =>
  `${providedTitle} ${a} ${b} -> ${c}`.trim();

test(gbnt, ["b1"], "x1", "x1");
test(gbnt, ["b1"], "b*", "b2");
test(gbnt, ["b1"], "b**", "b2");
test(gbnt, ["b1", "b2"], "b*", "b3");
test(gbnt, ["b1", "b2", "b3"], "b*", "b4");
test(gbnt, ["b1", "mkpr/1"], "mkpr/*", "mkpr/2");

function sbnst(t, names, result) {
  t.deepEqual(stripBaseNames(names, ["https://github.com/"]), result);
}

sbnst.title = (providedTitle = "stripBaseNames", a, b) =>
  `${providedTitle} ${a} -> ${b}`.trim();

test(sbnst, undefined, undefined);
test(sbnst, [], []);
test(sbnst, "a", "a");
test(sbnst, ["a", "b"], ["a", "b"]);
test(sbnst, "https://github.com/u1/r1", "u1/r1");

function sbnt(t, name, result) {
  t.is(stripBaseName(name, ["https://github.com/"]), result);
}

sbnt.title = (providedTitle = "stripBaseName", a, b) =>
  `${providedTitle} ${a} -> ${b}`.trim();

test(sbnt, undefined, undefined);
test(sbnt, "a", "a");
test(sbnt, "https://github.com/u1/r1", "u1/r1");
