import test from "ava";
import { Provider } from "../src/provider";
import { Branch } from "../src/branch";

test("branch", async t => {
  const provider = new Provider();
  const repository = await provider.createRepository("r1");

  const b = new Branch(repository, "b1");

  t.is(b.repository, repository);
  t.is(b.provider, provider);
  t.is(b.name, "b1");
  t.is(b.fullName, "r1#b1");
  t.is(b.fullCondensedName, "r1#b1");
  t.is(b.isDefault, false);
  t.is(b.ref, "refs/heads/b1");
  t.is(await repository.branch("b1"), b);
});

test("branch isDefault", async t => {
  const provider = new Provider();
  const repository = await provider.createRepository("r1");
  const b = new Branch(repository, "master");
  t.is(b.fullName, "r1#master");
  t.is(b.fullCondensedName, "r1");
  t.is(b.isDefault, true);
});

test("branch delete", async t => {
  const provider = new Provider();
  const repository = await provider.createRepository("r1");

  const b = new Branch(repository, "b1");
  await b.delete();

  t.is(await repository.branch("b1"), undefined);
});
