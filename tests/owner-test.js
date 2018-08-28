import test from "ava";
import { Owner } from "../src/owner";

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

test("owner get undefined repository + branch", async t => {
  const owner = new Owner();
  const branch = await owner.branch(undefined);
  t.is(branch, undefined);
});
