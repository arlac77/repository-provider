import test from "ava";
import { Owner, Branch } from "repository-provider";

test("owner create repository", async t => {
  const owner = new Owner();
  const repository = await owner.createRepository("r1", {
    id: 123,
    description: "a description"
  });
  t.is(repository.name, "r1");
  t.is(repository.condensedName, "r1");
  t.is(repository.type, "git");
  t.is(repository.id, 123);
  t.is(repository.description, "a description");

  await repository.delete();
  t.is(await owner.repository("r1"), undefined);
});

test("owner get repository", async t => {
  const owner = new Owner();
  await owner.createRepository("r1");
  const repository = await owner.repository("r1");
  t.is(repository.name, "r1");
  t.is(repository.condensedName, "r1");
});

test("owner list branches", async t => {
  const owner = new Owner();
  new Branch(await owner.createRepository("r1"));
  new Branch(await owner.createRepository("r2"));
  new Branch(await owner.createRepository("x"));
  new Branch(await owner.createRepository("yr2"));

  const m = {};

  for await (const b of owner.branches("r*")) {
    m[b.fullName] = b;
  }

  t.is(m["r1#master"].fullName, "r1#master");
  t.falsy(m.x);
});

test("owner get repository with branch", async t => {
  const owner = new Owner();
  await owner.createRepository("r1");
  const repository = await owner.repository("r1#master");
  t.is(repository.name, "r1");
  t.is(repository.condensedName, "r1");
});

test("owner repository urls", async t => {
  const owner = new Owner();
  const repository = await owner.createRepository("r1");
  t.deepEqual(repository.urls, []);
});

test("owner get undefined repository", async t => {
  const owner = new Owner();
  const repository = await owner.repository(undefined);
  t.is(repository, undefined);
});

test("owner get undefined repository + branch", async t => {
  const owner = new Owner();
  const branch = await owner.branch(undefined);
  t.is(branch, undefined);
});
