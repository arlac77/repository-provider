import test from "ava";
import { repositoryListTest } from "repository-provider-test-support";
import { MultiGroupProvider } from "repository-provider";


class MyProvider extends MultiGroupProvider {
  get repositoryBases() {
    return super.repositoryBases.concat(["https://myrepo/"]);
  }
}

const provider = new MyProvider();

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

const allResult = { ...g1Result, ...g2Result };

test(repositoryListTest, provider, "g1/*", g1Result);
test(repositoryListTest, provider, "https://myrepo/g1/*", g1Result);

test(repositoryListTest, provider, "*", allResult);
test(repositoryListTest, provider, "", allResult);
test(repositoryListTest, provider, "https://myrepo/*", allResult);
test(repositoryListTest, provider, "*/r*", allResult);
test(repositoryListTest, provider, "https://myrepo/*/r*", allResult);
test(repositoryListTest, provider, undefined, allResult);

test(repositoryListTest, provider, "*/x*");
test(repositoryListTest, provider, "https://myrepo/*/x*");
test(repositoryListTest, provider, "g3/*", undefined);
test(repositoryListTest, provider, "https://myrepo/g3/*", undefined);

test(repositoryListTest, new MyProvider(), undefined, undefined);
test(repositoryListTest, new MyProvider(), "*", undefined);
test("empty array *", repositoryListTest, new MyProvider(), ["*"], undefined);
