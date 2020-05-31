import test from "ava";
import { Provider } from "repository-provider";

class CaseInsensitiveProvider extends Provider {
  get areRepositoryNamesCaseSensitive() {
    return false;
  }

  get areGroupNamesCaseSensitive() {
    return false;
  }
}

async function createProvider(factory = Provider) {
  const provider = new factory();
  const g1 = await provider.createRepositoryGroup("g1");
  const g2 = await provider.createRepositoryGroup("g2");
  await provider.createRepositoryGroup("Upper");

  await g1.createRepository("r1");
  await g2.createRepository("r2");

  return provider;
}

async function pgrt(t, factory, name, result) {
  const provider = await createProvider(factory);
  const group = await provider.repositoryGroup(name);

  if (result === undefined) {
    t.is(group, undefined, `no group for '${name}'`);
  } else {
    if (group) {
      t.is(group.name, result, `lookup '${name}'`);
    } else {
      t.fail(`group not found for '${name}'`);
    }
  }
}

pgrt.title = (providedTitle = "", factory, name, result) =>
  `${factory.name} get group ${providedTitle} '${name}'`.trim();

test(pgrt, Provider, "g1", "g1");
test(pgrt, Provider, "Upper", "Upper");
test(pgrt, CaseInsensitiveProvider, "Upper", "Upper");
test(pgrt, CaseInsensitiveProvider, "upper", "Upper");

test("provider repository group create repository", async t => {
  const provider = new Provider();
  t.is(await provider.repositoryGroup("g1"), undefined);
  const g1 = await provider.createRepositoryGroup("g1");
  const r1 = await g1.createRepository("r1");

  t.is(r1.name, "r1");
  t.is(await g1.repository("r1"), r1);
  t.is(await provider.repository("g1/r1#branch"), r1);
  t.is(await provider.repository("g2/r1"), undefined);
});

test("provider repository group list", async t => {
  const provider = await createProvider();
  const gs = {};

  for await (const g of provider.repositoryGroups("*")) {
    gs[g.name] = g;
  }

  t.is(gs.g1.name, "g1");
});

test("provider repository list default", async t => {
  const provider = await createProvider();
  const rs = {};

  for await (const r of provider.repositories()) {
    rs[r.fullName] = r;
  }

  t.is(Object.keys(rs).length, 2);
  t.is(rs["g1/r1"].name, "r1");
  t.is(rs["g1/r1"].fullName, "g1/r1");
});

test("provider repository list **/*", async t => {
  const provider = await createProvider();
  const rs = {};

  for await (const r of provider.repositories("*/*")) {
    rs[r.fullName] = r;
  }

  t.is(Object.keys(rs).length, 2);
  t.is(rs["g1/r1"].name, "r1");
  t.is(rs["g1/r1"].fullName, "g1/r1");
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
