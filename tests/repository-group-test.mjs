import test from "ava";
import {
  MultiGroupProvider,
  RepositoryGroup,
  Repository,
  Branch,
  PullRequest
} from "repository-provider";

test("repository-group create with options", t => {
  const provider = new MultiGroupProvider();
  const rg = new RepositoryGroup(provider, "rg", {
    description: "a description",
    id: "4711",
    uuid: "12345",
    homePageURL: "http://somewhere/rg"
  });
  t.is(rg.name, "rg");
  t.is(rg.description, "a description");
  t.is(rg.id, "4711");
  t.is(rg.uuid, "12345");
  t.is(rg.homePageURL, "http://somewhere/rg");
  //t.is(rg.toString(), "rg");
  t.deepEqual(rg.toJSON(), {
    name: "rg",
    uuid: "12345",
    id: "4711",
    description: "a description",
    homePageURL: "http://somewhere/rg",
    isAdmin: false
  });
});

test("repository-group classes", t => {
  const provider = new MultiGroupProvider();
  const rg = new RepositoryGroup(provider, "rg");

  t.is(rg.repositoryClass, Repository);
  t.is(rg.branchClass, Branch);
  t.is(rg.entryClass, undefined);
  t.is(rg.pullRequestClass, PullRequest);
});

test("repository-group add repo", async t => {
  const provider = new MultiGroupProvider();
  const rg = new RepositoryGroup(provider, "rg");

  const r1 = rg.addRepository("r1");
  t.is(await rg.repository("r1"), r1);
});


test("owner create repository", async t => {
  const provider = new MultiGroupProvider();
  const group = new RepositoryGroup(provider,"g1");
  const repository = await group.createRepository("r1", {
    id: 123,
    description: "a description"
  });
  t.is(repository.name, "r1");
  t.is(repository.condensedName, "r1");
  t.is(repository.type, "git");
  t.is(repository.id, 123);
  t.is(repository.description, "a description");

  await repository.delete();
  t.is(await group.repository("r1"), undefined);
});

test("owner get repository", async t => {
  const provider = new MultiGroupProvider();
  const group = new RepositoryGroup(provider,"g1");
  await group.createRepository("r1");
  const repository = await group.repository("r1");
  t.is(repository.name, "r1");
  t.is(repository.condensedName, "r1");
});

test("owner list branches", async t => {
  const provider = new MultiGroupProvider();
  const group = new RepositoryGroup(provider,"g1");
  new Branch(await group.createRepository("r1"));
  new Branch(await group.createRepository("r2"));
  new Branch(await group.createRepository("x"));
  new Branch(await group.createRepository("yr2"));

  const m = {};

  for await (const b of group.branches("r*")) {
    m[b.fullName] = b;
  }

  t.is(m["g1/r1#master"].fullName, "g1/r1#master");
  t.falsy(m.x);
});

test("owner get repository with branch", async t => {
  const provider = new MultiGroupProvider();
  const group = new RepositoryGroup(provider,"g1");
  await group.createRepository("r1");
  const repository = await group.repository("r1#master");
  t.is(repository.name, "r1");
  t.is(repository.condensedName, "r1");
});

test("owner repository urls", async t => {
  const provider = new MultiGroupProvider();
  const group = new RepositoryGroup(provider,"g1");
  const repository = await group.createRepository("r1");
  t.deepEqual(repository.urls, []);
});

test("owner get undefined repository", async t => {
  const provider = new MultiGroupProvider();
  const group = new RepositoryGroup(provider,"g1");
  const repository = await group.repository(undefined);
  t.is(repository, undefined);
});

test("owner get undefined repository + branch", async t => {
  const provider = new MultiGroupProvider();
  const group = new RepositoryGroup(provider,"g1");
  const branch = await group.branch(undefined);
  t.is(branch, undefined);
});
