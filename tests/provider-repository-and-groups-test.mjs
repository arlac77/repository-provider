import test from "ava";
import { MultiGroupProvider } from "repository-provider";


test("provider repository group create repository", async t => {
  const provider = new MultiGroupProvider();
  t.is(await provider.repositoryGroup("g1"), undefined);
  const g1 = await provider.addRepositoryGroup("g1");
  const r1 = await g1.createRepository("r1");

  t.is(r1.name, "r1");
  t.is(await g1.repository("r1"), r1);
  t.is(await provider.repository("g1/r1#branch"), r1);
  t.is(await provider.repository("g2/r1"), undefined);
});
