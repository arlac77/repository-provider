import test from "ava";
import { repositoryListTest } from "repository-provider-test-support";
import { MultiGroupProvider } from "repository-provider";

const provider = new MultiGroupProvider();

test.before(async t => {
  const g1 = await provider.addRepositoryGroup("g1");
  await g1.addRepository("r1");
  await g1.addRepository("r2");
  const g2 = await provider.addRepositoryGroup("g2");
  await g2.addRepository("r1");
  await provider.addRepositoryGroup("g3");
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

test(repositoryListTest, new MultiGroupProvider(), undefined, undefined);
test(repositoryListTest, new MultiGroupProvider(), "*", undefined);
test("empty array *", repositoryListTest, new MultiGroupProvider(), ["*"], undefined);
