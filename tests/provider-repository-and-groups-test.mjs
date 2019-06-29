import test from "ava";
import { Provider } from "../src/provider.mjs";


test("provider normalize repo name", async t => {
  const provider = new Provider();
  t.is(provider.normalizeRepositoryName('abc'),'abc');
  t.is(provider.normalizeRepositoryName('abc/def'),'abc/def');
  t.is(provider.normalizeRepositoryName('abc/def#mybranch'),'abc/def');
  t.is(provider.normalizeRepositoryName('abc/def.git'),'abc/def');
  t.is(provider.normalizeRepositoryName('abc/def.git#mybranch'),'abc/def');
});


test("provider repository group", async t => {
  const provider = new Provider();
  t.is(await provider.repositoryGroup("p1"), undefined);
  const p1 = await provider.createRepositoryGroup("p1");
  t.is(p1.name, "p1");
  t.is(await provider.repositoryGroup("p1"), p1);
});

test("provider repository group create repository", async t => {
  const provider = new Provider();
  t.is(await provider.repositoryGroup("g1"), undefined);
  const g1 = await provider.createRepositoryGroup("g1");
  const r1 = await g1.createRepository("r1");

  t.is(r1.name, "r1");
  t.is(await g1.repository("r1"), r1);
  t.is(await provider.repository('g1/r1#branch'), r1);
});

test("provider repository group list", async t => {
  const provider = new Provider();
  await provider.createRepositoryGroup("g1");
  await provider.createRepositoryGroup("g2");

  const gs = {};

  for await (const g of provider.repositoryGroups("*")) {
    gs[g.name] = g;
  }

  t.is(gs.g1.name, 'g1');
});

async function setupProvider() {
  const provider = new Provider();
  const g1 = await provider.createRepositoryGroup("g1");
  const g2 = await provider.createRepositoryGroup("g2");

  await g1.createRepository('r1');
  await g2.createRepository('r2');
  return provider;
}

test("provider repository list default", async t => {
  const provider = await setupProvider();
  const rs = {};

  for await (const r of provider.repositories()) {
    rs[r.fullName] = r;
  }

  t.is(Object.keys(rs).length, 2);
  t.is(rs['g1/r1'].name, 'r1');
  t.is(rs['g1/r1'].fullName, 'g1/r1');
});

test("provider repository list **/*", async t => {
  const provider = await setupProvider();
  const rs = {};

  for await (const r of provider.repositories('*/*')) {
    rs[r.fullName] = r;
  }

  t.is(Object.keys(rs).length, 2);
  t.is(rs['g1/r1'].name, 'r1');
  t.is(rs['g1/r1'].fullName, 'g1/r1');
});

test("get repository#branch", async t => {
  const provider = new Provider();
  const r = await provider.createRepository("r1");
  const b = await r.createBranch("b1");

  const branch = await provider.branch("r1#b1");
  t.is(branch.name, "b1");
  t.is(branch.repository, r);
  t.is(branch.provider, provider);
});

test("get repository + default branch", async t => {
  const provider = new Provider();
  const r = await provider.createRepository("r1");
  const b = await r.createBranch("master");

  const branch = await provider.branch("r1");
  t.is(branch.name, "master");
  t.is(branch.repository, r);
  t.is(branch.provider, provider);
});

test("get unknown repository + branch", async t => {
  const provider = new Provider();
  const r = await provider.createRepository("r1");
  const b = await r.createBranch("master");

  t.is(await provider.branch("r2#master"), undefined);
  t.is(await provider.branch("r2"), undefined);
});
