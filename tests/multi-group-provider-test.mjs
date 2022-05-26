import test from "ava";
import { MultiGroupProvider } from "repository-provider";

test("MultiGroupProvider type", t => t.is(MultiGroupProvider.type, "provider"));
test("MultiGroupProvider collection name", t => t.is(MultiGroupProvider.collectionName, "providers"));

export async function groupTest(t, provider, name, expected) {
  const group = await provider.repositoryGroup(name);

  if (expected === undefined) {
    t.is(group, expected);
  } else {
    t.is(group.name, expected);
  }
}

groupTest.title = (providedTitle = "group", provider, name, expected) =>
  `${providedTitle} ${name} ${
    typeof expected === "number"
      ? ">=#" + expected
      : expected
      ? "[" + Object.keys(expected) + "]"
      : "not present"
  }`.trim();

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
});

test(groupTest, provider, "g1", "g1");
test(groupTest, provider, "g1/r1", "g1");
test(groupTest, provider, "g1/r1#master", "g1");
test(groupTest, provider, "https://myrepo/g1/", "g1");

test(groupTest, provider, "gx", undefined);
test(groupTest, provider, "gx/r3", undefined);

test("create group", async t => {
  const p = new MultiGroupProvider();
  await p.createRepositoryGroup("g1");

  const g1 = await p.repositoryGroup("g1");
  t.assert(g1.name, "g1");
});
