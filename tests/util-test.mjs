import test from "ava";
import { Provider } from "../src/provider.mjs";
import { Branch } from "../src/branch.mjs";
import {
  generateBranchName,
  definePropertiesFromOptions
} from "../src/util.mjs";

async function gbnt(t, branchNames, pattern, result) {
  const provider = new Provider();
  const repository = await provider.createRepository("r1");

  for (const bn of branchNames) {
    new Branch(repository, bn);
  }

  t.is(await generateBranchName(repository, pattern), result);
}

gbnt.title = (providedTitle = "", a, b) =>
  `generateBranchName ${providedTitle} ${a} ${b}`.trim();

test(gbnt, ["b1"], "x1", "x1");
test(gbnt, ["b1"], "b*", "b2");
test(gbnt, ["b1", "b2"], "b*", "b3");
test(gbnt, ["b1", "b2", "b3"], "b*", "b4");
test(gbnt, ["b1", "mkpr/1"], "mkpr/*", "mkpr/2");

test("props", t => {
  const object = {};

  definePropertiesFromOptions(object, { name: "a" });
  t.is(object.a, undefined);
});
