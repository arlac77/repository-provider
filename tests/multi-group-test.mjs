import test from "ava";
import { MultiGroupProvider } from "repository-provider";

test("create group", async t => {
  const p = new MultiGroupProvider();
  await p.createRepositoryGroup("g1");

  const g1 = await p.repositoryGroup("g1");
  t.assert(g1.name, "g1");
});
