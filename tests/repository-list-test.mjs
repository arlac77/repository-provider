import test from "ava";
import { repositoryListTest } from "repository-provider-test-support/src/repository-list-test.mjs";
import { Provider } from "../src/provider.mjs";

const provider = new Provider();

test.before(async t => {
  const g1 = await provider.addRepositoryGroup("g1");
  await g1.addRepository("r1");
  await g1.addRepository("r2");
  const g2 = await provider.addRepositoryGroup("g2");
  await g2.addRepository("r1");
  const g3 = await provider.addRepositoryGroup("g3");
});

const g1Result = {
  "g1/r1": { name: "r1" },
  "g1/r2": { name: "r2" }
};

const g2Result = {
  "g2/r1": { name: "r1" }
};

test(repositoryListTest, provider, "g1/*", g1Result);
test(repositoryListTest, provider, "*", { ...g1Result, ...g2Result });
test(repositoryListTest, provider, "*/r*", { ...g1Result, ...g2Result });
test(repositoryListTest, provider, undefined, { ...g1Result, ...g2Result });
test(repositoryListTest, provider, "*/x*");
test(repositoryListTest, provider, "g3/*", undefined);

test(repositoryListTest, new Provider(), undefined, undefined);
test(repositoryListTest, new Provider(), "*", undefined);
test("empty array *", repositoryListTest, new Provider(), ["*"], undefined);
