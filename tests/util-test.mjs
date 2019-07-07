import test from "ava";
import { Provider } from "../src/provider.mjs";
import { Branch } from "../src/branch.mjs";
import { generateBranchName } from "../src/util.mjs";

test("branch", async t => {
  const provider = new Provider();
  const repository = await provider.createRepository("r1");

  new Branch(repository, "b1");

  t.is(await generateBranchName(repository, "b*"), "b2");
  new Branch(repository, "b2");

  t.is(await generateBranchName(repository, "b*"), "b3");
  new Branch(repository, "b3");

  t.is(await generateBranchName(repository, "b*"), "b4");
});
