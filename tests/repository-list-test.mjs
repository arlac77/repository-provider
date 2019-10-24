import test from "ava";
import { repositoryListTest } from "repository-provider-test-support/src/repository-list-test.mjs";
import { Provider } from "../src/provider.mjs";

const provider = new Provider();

test.before(async t => {
  const g1 = await provider._createRepositoryGroup("g1");
  await g1.createRepository("r1");
  await g1.createRepository("r2");
  const g2 = await provider._createRepositoryGroup("g2");
});

const fullResult = {
  r1: { name: "r1" },
  r2: { name: "r2" }
};

test(repositoryListTest, provider, "g1/*", fullResult);
test(repositoryListTest, provider, "*", fullResult);
test(repositoryListTest, provider, undefined, fullResult);
test(repositoryListTest, provider, "g2/*", undefined);

test(repositoryListTest, new Provider(), undefined, undefined);
test(repositoryListTest, new Provider(), "*", undefined);
test("empty array *", repositoryListTest, new Provider(), ["*"], undefined);
