import test from "ava";
import { Owner } from "../src/owner";
import { Repository } from "../src/repository";

test("repository create with options", t => {
  const owner = new Owner();
  const repository = new Repository(owner, "r1", {
    description: "a description",
    id: "4711"
  });
  t.is(repository.owner, owner);
  t.is(repository.name, "r1");
  t.is(repository.type, "git");
  t.is(repository.description, "a description");
  t.is(repository.id, "4711");
});

test("repository create without options", t => {
  const owner = new Owner();
  const repository = new Repository(owner, "r1");
  t.is(repository.owner, owner);
  t.is(repository.name, "r1");
  t.is(repository.type, "git");
  t.is(repository.description, undefined);
});

test("repository normalize name", t => {
  const owner = new Owner();
  const repository = new Repository(owner, "r1#branch");
  t.is(repository.owner, owner);
  t.is(repository.name, "r1");
});
